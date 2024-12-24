package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/openai/openai-go"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"github.com/ucok-man/fs-video-transcriber-server/internal/validator"
)

const MAX_100MB = 100 << 20 // 100 MB
const UPLOAD_DIR = "./upload"

var ALLOWED_FILE_TYPES = []string{
	"video/mp4",
	"video/mpeg",
	"video/ogg",
	"video/webm",
	"video/quicktime",
}

func (app *application) transcribeVideoHandler(w http.ResponseWriter, r *http.Request) {
	// Parse form data
	if err := r.ParseMultipartForm(MAX_100MB); err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	// Get the data from field
	file, handler, err := r.FormFile("file")
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}
	defer file.Close()

	v := validator.New()
	v.Check(
		validator.In(handler.Header.Get("Content-Type"), ALLOWED_FILE_TYPES...), "fileformat", fmt.Sprintf("must be in this type %v", ALLOWED_FILE_TYPES),
	)
	if !v.Valid() {
		app.failedValidationResponse(w, r, v.Errors)
		return
	}

	// Prepare filepath name
	fExt := filepath.Ext(handler.Filename)
	baseName := strings.TrimSuffix(handler.Filename, fExt)
	videoBaseName := baseName + "_" + "video"
	audioBaseName := baseName + "_" + "audio"
	timestamp := time.Now().Format("20060102_150405")

	videoBaseName = fmt.Sprintf("%s_%s%s", videoBaseName, timestamp, fExt)
	audioBaseName = fmt.Sprintf("%s_%s.wav", audioBaseName, timestamp)

	var (
		outVideo = filepath.Join(UPLOAD_DIR, videoBaseName)
		outAudio = filepath.Join(UPLOAD_DIR, audioBaseName)
	)

	// Save file and Convert to audio format
	filedata, err := io.ReadAll(file)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	if err := os.WriteFile(outVideo, filedata, 0o600); err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	err = ffmpeg.
		Input(outVideo).
		Output(outAudio, ffmpeg.KwArgs{"vn": ""}). // "vn" removes the video stream, keeping only audio
		Silent(true).
		Run()

	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	// Transcribe file
	audiofile, err := os.Open(outAudio)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute) // Adjust timeout for large files
	defer cancel()

	transcriptionParams := openai.AudioTranscriptionNewParams{
		File:        openai.FileParam(audiofile, audiofile.Name(), filepath.Base(handler.Header.Get("Content-Type"))),
		Model:       openai.String("whisper-1"), // Specify the model
		Temperature: openai.Float(0.5),          // Optional: adjust for transcription variability
	}

	response, err := app.config.openai.client.Audio.Transcriptions.New(ctx, transcriptionParams)
	if err != nil {
		app.serverErrorResponse(w, r, fmt.Errorf("failed to transcribe audio: %w", err))
		return
	}

	// Respond with the transcription result
	dataresponse := envelope{
		"success":    true,
		"transcribe": response.Text,
	}
	err = app.writeJSON(w, http.StatusOK, dataresponse, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}
}

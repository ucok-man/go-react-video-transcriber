package dto

type Trasncribe_POST_Response struct {
	Success    bool   `json:"success"`
	Transcribe string `json:"transcribe"` //content
}

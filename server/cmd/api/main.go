package main

import (
	"errors"
	"flag"
	"os"
	"strings"
	"sync"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"github.com/ucok-man/fs-video-transcriber-server/internal/jsonlog"
)

var (
	version = "0.0.1"
)

type config struct {
	port   int
	env    string
	openai struct {
		apikey string
		client *openai.Client
	}
	limiter struct {
		rps     float64
		burst   int
		enabled bool
	}
	cors struct {
		trustedOrigins []string
	}
}

type application struct {
	config config
	logger *jsonlog.Logger
	wg     sync.WaitGroup
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production")
	flag.StringVar(&cfg.openai.apikey, "openai-apikey", "", "OpenAI API KEY")
	flag.Float64Var(&cfg.limiter.rps, "limiter-rps", 2, "Rate limiter maximum requests per second")
	flag.IntVar(&cfg.limiter.burst, "limiter-burst", 4, "Rate limiter maximum burst")
	flag.BoolVar(&cfg.limiter.enabled, "limiter-enabled", true, "Enable rate limiter")
	flag.Func("cors-trusted-origins", "Trusted CORS origins (space separated)", func(val string) error {
		cfg.cors.trustedOrigins = strings.Fields(val)
		return nil
	})
	flag.Parse()

	logger := jsonlog.NewLogger(os.Stdout, jsonlog.LevelInfo)

	if cfg.openai.apikey == "" {
		logger.PrintFatal(errors.New("require openai api key to be provided"), nil)
	}

	client := openai.NewClient(
		option.WithAPIKey(cfg.openai.apikey),
	)
	cfg.openai.client = client

	app := &application{
		config: cfg,
		logger: logger,
	}

	// Call app.server() to start the server.
	if err := app.serve(); err != nil {
		logger.PrintFatal(err, nil)
	}
}

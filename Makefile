# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' | sed -e 's/^//'

.PHONY: confirm
confirm:
	@echo 'Are you sure? [y/N]' && read ans && [ $${ans:-N} = y ]

## app/run: run the application container
.PHONY: app/run
app/run:
	@docker compose up -d

## app/build: run container and rebuild the image
.PHONY: app/build
app/build:
	@docker compose up -d --build

## app/down: stop the application container
.PHONY: app/down
app/down:
	@docker compose down -v

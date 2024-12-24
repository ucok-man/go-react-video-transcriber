# Stage 1: Build the Go application
FROM golang:1.23 AS go-base
WORKDIR /usr/src/app
# Install dependencies
COPY go.mod go.sum ./
RUN go mod download
# Build the application
COPY . .
RUN make build/api

# Stage 2: Base image for deployment
FROM debian:bookworm-slim AS api-base
WORKDIR /usr/src/app
# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean
# Add user
RUN groupadd -r api && useradd --no-log-init -r -g api api
# Create directories with correct ownership and permissions
RUN mkdir -p /usr/src/app/upload && chmod 755 /usr/src/app/upload && chown -R api:api /usr/src/app

# Stage 3: Release image
FROM api-base AS release
WORKDIR /usr/src/app
# Copy build artifacts and dependencies
COPY --from=go-base /usr/src/app/bin/api /api
COPY --from=go-base /usr/src/app/upload /usr/src/app/upload
# Serve the API
USER api:api
EXPOSE 4000/tcp
ENTRYPOINT ["/bin/sh", "-c", "/api -cors-trusted-origins ${FRONTEND_URL} -openai-apikey ${OPENAI_API_KEY}"]


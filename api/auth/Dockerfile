FROM golang:1.25.1-alpine AS builder

WORKDIR /auth

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

FROM alpine:latest

WORKDIR /root/

RUN apk --no-cache add ca-certificates

COPY --from=builder /auth/main .

EXPOSE 8001

CMD ["./main"]
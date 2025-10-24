FROM golang:1.25.1-alpine AS builder

WORKDIR /operational

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

FROM alpine:latest

WORKDIR /root/

RUN apk --no-cache add ca-certificates

COPY --from=builder /operational/main .

EXPOSE 8010

CMD ["./main"]
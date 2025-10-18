package main

import (
	"auth-service/config"
	"auth-service/routes"
	"fmt"
	"log"
	"net/http"
)

func main() {
	config.ConnectDB()
	r := routes.SetupRouter()
	port := ":8001"
	fmt.Printf("🚀 Auth Service running on http://localhost%s\n", port)
	if err := http.ListenAndServe(port, r); err != nil {
		log.Fatal("Server failed to start:", err)
	}
} 
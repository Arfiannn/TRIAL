package main

import (
	"fmt"
	"trial/config"
	"trial/routes"
)

func main() {
	config.ConnectDB()
	r := routes.SetupRouter()
	fmt.Println("🚀 TRIAL API berjalan di http://localhost:8080 🚀")
	r.Run(":8080")
}

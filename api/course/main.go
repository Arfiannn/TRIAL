package main

import (
	"course/config"
	"course/routes"
	"course/controllers"
	"course/models"
	"fmt"

)

func main() {
	config.ConnectDB()
	r := routes.SetupRouter()
	fmt.Println("🚀 course API berjalan di http://localhost:8081 🚀")
	r.Run(":8081")
}

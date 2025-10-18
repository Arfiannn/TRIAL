package main

import (
	"course-service/config"
	"course-service/routes"
	"fmt"
)

func main() {
	config.ConnectDB()
	r := routes.SetupRouter()

	fmt.Println("🚀 Course Service berjalan di http://localhost:8081 🚀")
	r.Run(":8081")

}

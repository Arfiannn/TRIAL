package main

import (
	"course-service/config"
	"fmt"
)

func main() {
	config.ConnectDB()

	fmt.Println("🚀 Course Service berjalan di http://localhost:8081 🚀")

}

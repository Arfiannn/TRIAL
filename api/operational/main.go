package main

import (
	"fmt"
	"operational_service/config"
	"operational_service/routes"
)

func main() {
	config.ConnectDB()
	r := routes.SetupRouter()
	fmt.Println("🚀 operational_service berjalan di http://localhost:8010 🚀")
	r.Run(":8010")
}

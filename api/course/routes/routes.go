package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	SetupRoutes(r)

	return r
}

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/")

	AdminRoutes(api.Group("/admin"))
	LecturerRoutes(api.Group("/lecturer"))
	StudentRoutes(api.Group("/student"))
}

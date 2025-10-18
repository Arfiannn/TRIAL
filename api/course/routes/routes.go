package routes

import "github.com/gin-gonic/gin"

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	AdminRoutes(api.Group("/admin"))
	LecturerRoutes(api.Group("/lecturer"))
	StudentRoutes(api.Group("/student"))
}
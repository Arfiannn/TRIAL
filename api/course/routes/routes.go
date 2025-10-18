package routes

import "github.com/gin-gonic/gin"

func SetupRouter() *gin.Engine {
	r := gin.Default()
	SetupRoutes(r)
	return r
}

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")

	AdminRoutes(api.Group("/admin"))
	LecturerRoutes(api.Group("/lecturer"))
	StudentRoutes(api.Group("/student"))
}

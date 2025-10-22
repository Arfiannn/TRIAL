package routes

import (
	"operational_service/controllers"
	"operational_service/middleware"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/")
	api.Use(middleware.AuthMiddleware())

	api.POST("/assignments", controllers.CreateAssignment)
	api.GET("/assignments", controllers.GetAllAssignments)
	api.GET("/assignments/:id", controllers.GetAssignmentByID)
	api.GET("/assignments/:id/file", controllers.GetAssignmentFile)
	api.PUT("/assignments/:id", controllers.UpdateAssignment)
	api.DELETE("/assignments/:id", controllers.DeleteAssignment)

	api.POST("/submission", controllers.CreateSubmission)
	api.GET("/submission", controllers.GetAllSubmission)
	api.GET("/submission/:id", controllers.GetSubmissionByID)
	api.GET("/submission/:id/file", controllers.GetSubmissionFile)

	return r
}

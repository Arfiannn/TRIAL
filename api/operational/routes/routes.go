package routes

import (
	"operational_service/controllers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/assignments", controllers.CreateAssignment)
	r.GET("/assignments", controllers.GetAllAssignments)
	r.GET("/assignments/:id", controllers.GetAssignmentByID)
	r.PUT("/assignments/:id", controllers.UpdateAssignment)
	r.DELETE("/assignments/:id", controllers.DeleteAssignment)
	r.GET("/assignments/:id/file", controllers.GetAssignmentFile)

	r.POST("/submission", controllers.CreateSubmission)
	r.GET("/submission", controllers.GetAllSubmission)
	r.GET("/submission/:id", controllers.GetSubmissionByID)
	r.GET("/submission/:id/file", controllers.GetSubmissionFile)

	return r
}

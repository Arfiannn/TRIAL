package routes

import (
	"course-service/controllers/lecturer/course"
	"course-service/controllers/lecturer/material"
	"course-service/middleware"

	"github.com/gin-gonic/gin"
)

func LecturerRoutes(r *gin.RouterGroup) {
	lecturer := r.Group("")
	lecturer.Use(middleware.JWTAuthMiddleware())

	materials := r.Group("/materials")
	{
		materials.POST("", material.UploadMaterial)
		materials.GET("", material.GetAllMaterials)
		materials.GET("/:id", material.GetMaterialByID)
		materials.PUT("/:id", material.UpdateMaterial)
		materials.DELETE("/:id", material.DeleteMaterial)
	}

	courses := r.Group("/courses")
	{
		courses.GET("/:id", course.GetCoursesByLecturerID)
	}
}

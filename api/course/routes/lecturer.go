package routes

import (
	"course-service/controllers/lecturer/course"
	"course-service/controllers/lecturer/material"
	"course-service/middleware"

	"github.com/gin-gonic/gin"
)

func LecturerRoutes(r *gin.RouterGroup) {

	lecturer := r.Group("")
	lecturer.Use(middleware.JWTAuthMiddleware(), middleware.RoleOnly(2))

	materials := lecturer.Group("/materials")
	{
		materials.POST("", material.UploadMaterial)
		materials.GET("", material.GetAllMaterials)
		materials.GET("/:id", material.GetMaterialByID)
		materials.PUT("/:id", material.UpdateMaterial)
		materials.DELETE("/:id", material.DeleteMaterial)
		materials.GET("/:id/file", material.GetMaterialFile)
	}

	courses := lecturer.Group("/courses")
	{
		courses.GET("", course.GetAllCoursesByLecturerID)
		courses.GET("/:id", course.GetCourseByID)
	}
}

package routes

import (
	"course-service/controllers/lecturer/course"
	"course-service/controllers/lecturer/material"

	"github.com/gin-gonic/gin"
)

func LecturerRoutes(r *gin.RouterGroup) {

	materials := r.Group("/materials")
	{
		materials.POST("", material.UploadMaterial)
		materials.GET("", material.GetAllMaterials)
		materials.GET("/:id", material.GetMaterialByID)
		materials.PATCH("/:id", material.UpdateMaterial)
	}

	courses := r.Group("/courses")
	{
		courses.GET("/:id", course.GetCoursesByLecturerID)
	}
}

package routes

import (
	"course-service/controllers/admin/course"
	"course-service/controllers/lecturer/material"

	"github.com/gin-gonic/gin"
)

func StudentRoutes(r *gin.RouterGroup) {
	courses := r.Group("/courses")
	{
		courses.GET("/:semester", course.GetAllCourses)
		courses.GET("/detail/:id", course.GetCourseByID)
	}

	materials := r.Group("/materials")
	{
		materials.GET("", material.GetAllMaterials)
		materials.GET("/:id", material.GetMaterialByID)
	}
}

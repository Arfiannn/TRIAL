package routes

import (
	"course-service/controllers/student/course"
	"course-service/controllers/student/material"

	"github.com/gin-gonic/gin"
)

func StudentRoutes(r *gin.RouterGroup) {
	courses := r.Group("/courses")
	{
		courses.GET("", course.GetCoursesByStudent)
	}

	materials := r.Group("/materials")
	{
		materials.GET("/:courseId", material.GetMaterialsByCourseID)
	}
}

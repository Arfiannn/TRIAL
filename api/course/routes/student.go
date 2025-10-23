package routes

import (
	"course-service/controllers/student/course"
	"course-service/controllers/student/material"
	"course-service/middleware"

	"github.com/gin-gonic/gin"
)

func StudentRoutes(r *gin.RouterGroup) {

	student := r.Group("")
	student.Use(middleware.JWTAuthMiddleware(), middleware.RoleOnly(3))

	courses := student.Group("/courses")
	{
		courses.GET("", course.GetCoursesByStudent)
	}

	materials := student.Group("/materials")
	{
		materials.GET("/:courseId", material.GetMaterialsByCourseID)
		materials.GET("/view/:id", material.ViewMaterialByID)
	}
}

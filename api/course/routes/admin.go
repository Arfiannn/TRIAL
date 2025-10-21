package routes

import (
	"course-service/controllers/admin/course"
	"course-service/middleware"


	"github.com/gin-gonic/gin"
)

func AdminRoutes(r *gin.RouterGroup) {

	courses := r.Group("/courses")
	courses.Use(middleware.JWTAuthMiddleware())
	{
		courses.POST("", course.CreateCourse)
		courses.GET("", course.GetAllCourses)
		courses.GET("/:id", course.GetCourseByID)
		courses.PATCH("/:id", course.UpdateCourse)
		courses.DELETE("/:id", course.DeleteCourse)
	}
}

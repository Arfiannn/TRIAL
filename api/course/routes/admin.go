package routes

import (
	"course-service/controllers/admin/course"
	"course-service/middleware"

	"github.com/gin-gonic/gin"
)

func AdminRoutes(r *gin.RouterGroup) {

	admin := r.Group("")
	admin.Use(middleware.JWTAuthMiddleware(), middleware.RoleOnly(1))

	courses := admin.Group("/courses")
	{
		courses.POST("", course.CreateCourse)
		courses.GET("", course.GetAllCourses)
		courses.GET("/:id", course.GetCourseByID)
		courses.PATCH("/:id", course.UpdateCourse)
		courses.DELETE("/:id", course.DeleteCourse)
	}
}

package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetCoursesBySemester(c *gin.Context) {
	semester := c.Param("semester")
	var courses []models.Course
	config.DB.Where("semester = ?", semester).Find(&courses)
	c.JSON(http.StatusOK, gin.H{"data": courses})
}

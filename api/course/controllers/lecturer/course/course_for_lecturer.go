package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetCoursesByLecturerID(c *gin.Context) {
	lecturerID := c.Param("id")

	var courses []models.Course
	if err := config.DB.Where("lecturerId = ?", lecturerID).Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(courses) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No courses found for this lecturer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": courses})
}

package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllCourses(c *gin.Context) {
	var courses []models.Course
	config.DB.Find(&courses)
	c.JSON(http.StatusOK, gin.H{"data": courses})
}

func GetCourseByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid course ID"})
		return
	}

	var course models.Course
	if err := config.DB.First(&course, "id_course = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": course})
}

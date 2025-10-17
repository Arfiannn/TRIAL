package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UpdateCourse(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var course models.Course

	if err := config.DB.First(&course, "id_course = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
		return
	}

	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&course)
	c.JSON(http.StatusOK, gin.H{"message": "Course updated", "data": course})
}

package public

import (
	"net/http"

	"auth-service/config"
	"auth-service/models"
	"github.com/gin-gonic/gin"
)

func GetFaculties(c *gin.Context) {
	var faculties []models.Faculty
	if err := config.DB.Find(&faculties).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch faculties"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"faculties": faculties})
}

func GetMajors(c *gin.Context) {
	var majors []models.Major
	if err := config.DB.Find(&majors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch majors"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"majors": majors})
}
package public

import (
	"net/http"

	"auth-service/models"
	"github.com/gin-gonic/gin"
)

func GetFaculties(c *gin.Context) {
	faculties, err := models.GetAllFaculties()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch faculties"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"faculties": faculties})
}

func GetMajors(c *gin.Context) {
	majors, err := models.GetAllMajors()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch majors"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"majors": majors})
}
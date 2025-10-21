package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllCourses(c *gin.Context) {
	roleID := c.GetUint("role_id")
	if roleID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya admin yang boleh mengakses data ini"})
		return
	}

	var courses []models.Course
	if err := config.DB.Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data mata kuliah"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": courses})
}

func GetCourseByID(c *gin.Context) {
	roleID := c.GetUint("role_id")
	if roleID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya admin yang boleh mengakses data ini"})
		return
	}

	id := c.Param("id")

	var course models.Course
	if err := config.DB.First(&course, "id_course = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mata kuliah tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": course})
}

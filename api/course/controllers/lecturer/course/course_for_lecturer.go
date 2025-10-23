package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllCoursesByLecturerID(c *gin.Context) {
	lecturerID := c.GetUint("user_id")
	roleID := c.GetUint("role_id")

	if roleID != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya lecturer yang dapat mengakses course ini"})
		return
	}

	var courses []models.Course
	if err := config.DB.Where("lecturerId = ?", lecturerID).Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data course"})
		return
	}

	if len(courses) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Tidak ada course untuk lecturer ini"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": courses})
}

func GetCourseByID(c *gin.Context) {
	lecturerID := c.GetUint("user_id")
	roleID := c.GetUint("role_id")
	courseID := c.Param("id")

	if roleID != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya lecturer yang dapat mengakses course ini"})
		return
	}

	var course models.Course
	if err := config.DB.Where("id_course = ? AND lecturerId = ?", courseID, lecturerID).First(&course).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course tidak ditemukan atau bukan milik Anda"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": course})
}

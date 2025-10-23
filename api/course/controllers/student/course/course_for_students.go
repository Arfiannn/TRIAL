package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetCoursesByStudent(c *gin.Context) {
	studentID := c.GetUint("user_id")
	roleID := c.GetUint("role_id")

	if roleID != 3 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya student yang boleh mengakses data course ini"})
		return
	}

	if studentID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User tidak terautentikasi"})
		return
	}

	var student models.User
	if err := config.DB.First(&student, "id_user = ?", studentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mahasiswa tidak ditemukan"})
		return
	}

	var courses []models.Course
	if err := config.DB.
		Where("majorId = ?", student.MajorID).
		Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data course"})
		return
	}

	if len(courses) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Tidak ada course untuk jurusan dan semester ini"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Berhasil mengambil course berdasarkan jurusan dan semester mahasiswa",
		"data":    courses,
	})
}

package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetMaterialsByCourseID(c *gin.Context) {

	studentID := c.GetUint("user_id")
	roleID := c.GetUint("role_id")

	if roleID != 3 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya student yang boleh mengakses material"})
		return
	}

	courseIDParam := c.Param("courseId")
	courseID, err := strconv.Atoi(courseIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Course ID tidak valid"})
		return
	}

	var student models.User
	if err := config.DB.First(&student, "id_user = ?", studentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mahasiswa tidak ditemukan"})
		return
	}

	var course models.Course
	if err := config.DB.
		Where("id_course = ? AND majorId = ?", courseID, student.MajorID).
		First(&course).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Kamu tidak punya akses ke course ini"})
		return
	}

	var materials []models.Material
	if err := config.DB.
		Where("courseId = ?", courseID).
		Find(&materials).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data material"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Berhasil mengambil material untuk course ini",
		"data":    materials,
	})
}

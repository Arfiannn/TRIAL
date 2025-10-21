package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DeleteMaterial(c *gin.Context) {
	roleID := c.GetUint("role_id")
	if roleID != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya lecturer yang boleh menghapus material"})
		return
	}

	id := c.Param("id")

	var material models.Material
	if err := config.DB.First(&material, "id_material = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Material tidak ditemukan"})
		return
	}

	var course models.Course
	if err := config.DB.First(&course, "id_course = ?", material.CourseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course tidak ditemukan"})
		return
	}

	lecturerID := c.GetUint("user_id")
	if course.LecturerID != lecturerID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Kamu tidak punya akses untuk menghapus material dari course ini"})
		return
	}

	if err := config.DB.Delete(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus material"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Material berhasil dihapus"})
}

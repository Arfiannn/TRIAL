package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ViewMaterialByID(c *gin.Context) {
	studentID := c.GetUint("user_id")
	roleID := c.GetUint("role_id")

	if roleID != 3 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya student yang boleh mengakses material"})
		return
	}

	materialID := c.Param("id")
	var material models.Material

	if err := config.DB.First(&material, "id_material = ?", materialID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Material tidak ditemukan"})
		return
	}

	var student models.User
	if err := config.DB.First(&student, "id_user = ?", studentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mahasiswa tidak ditemukan"})
		return
	}

	var course models.Course
	if err := config.DB.
		Where("id_course = ? AND majorId = ?", material.CourseID, student.MajorID).
		First(&course).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Kamu tidak punya akses ke course ini"})
		return
	}

	if material.FileType == "" {
		material.FileType = "application/octet-stream"
	}

	c.Header("Content-Disposition", "inline; filename=material-file")
	c.Data(http.StatusOK, material.FileType, material.FileURL)
}

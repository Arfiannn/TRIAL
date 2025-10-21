package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateMaterial(c *gin.Context) {
	roleID := c.GetUint("role_id")
	if roleID != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya lecturer yang boleh mengubah material"})
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

	if course.LecturerID != c.GetUint("user_id") {
		c.JSON(http.StatusForbidden, gin.H{"error": "Kamu tidak punya akses untuk mengubah material dari course ini"})
		return
	}

	var input struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		FileURL     string `json:"file_url"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	material.Title = input.Title
	material.Description = input.Description
	material.FileURL = input.FileURL

	if err := config.DB.Save(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui material"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Material berhasil diperbarui",
		"data":    material})
}

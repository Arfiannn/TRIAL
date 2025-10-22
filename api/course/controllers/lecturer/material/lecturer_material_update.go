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

	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if title, ok := input["title"].(string); ok {
		material.Title = title
	}
	if desc, ok := input["description"].(string); ok {
		material.Description = desc
	}
	if file, ok := input["file_url"].(string); ok {
		material.FileURL = file
	}

	if err := config.DB.Save(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui material"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Material berhasil diperbarui",
		"data":    material,
	})
}

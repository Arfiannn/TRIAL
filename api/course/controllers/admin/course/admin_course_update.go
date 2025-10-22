package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateCourse(c *gin.Context) {
	roleID := c.GetUint("role_id")
	if roleID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya admin yang boleh mengubah mata kuliah"})
		return
	}

	id := c.Param("id")

	var existing models.Course
	if err := config.DB.First(&existing, "id_course = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mata kuliah tidak ditemukan"})
		return
	}

	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Model(&existing).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mata kuliah berhasil diubah",
		"data":    existing,
	})
}
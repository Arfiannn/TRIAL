package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetMaterialsByCourseID(c *gin.Context) {
	courseID := c.Param("courseId")

	var materials []models.Material
	if err := config.DB.Where("courseId = ?", courseID).Find(&materials).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Terjadi kesalahan saat mengambil data materi"})
		return
	}

	if len(materials) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Tidak ada materi untuk course ini"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Berhasil mengambil data materi",
		"data":    materials,
	})
}

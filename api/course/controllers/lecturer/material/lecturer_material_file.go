package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetMaterialFile(c *gin.Context) {
	id := c.Param("id")
	var material models.Material

	if err := config.DB.First(&material, "id_material = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Material tidak ditemukan"})
		return
	}

	contentType := material.FileType
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	c.Header("Content-Disposition", "inline; filename=material-file")
	c.Data(http.StatusOK, contentType, material.FileURL)
}

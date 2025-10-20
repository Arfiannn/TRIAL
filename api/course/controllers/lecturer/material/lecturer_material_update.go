package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func UpdateMaterial(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var material models.Material

	if err := config.DB.First(&material, "id_material = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Material not found"})
		return
	}

	if err := c.ShouldBindJSON(&material); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Save(&material)
	c.JSON(http.StatusOK, gin.H{"message": "Material updated", "data": material})
}

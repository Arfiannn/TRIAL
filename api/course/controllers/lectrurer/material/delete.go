package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func DeleteMaterial(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	config.DB.Delete(&models.Material{}, "id_material = ?", id)
	c.JSON(http.StatusOK, gin.H{"message": "Material deleted"})
}

package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func DeleteCourse(c *gin.Context) {
	roleID := c.GetUint("role_id")
	if roleID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya admin yang boleh menghapus mata kuliah"})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID mata kuliah tidak valid"})
		return
	}

	var course models.Course
	if err := config.DB.First(&course, "id_course = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Mata kuliah tidak ditemukan"})
		return
	}

	if err := config.DB.Delete(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus mata kuliah"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Mata kuliah berhasil dihapus oleh admin"})
}

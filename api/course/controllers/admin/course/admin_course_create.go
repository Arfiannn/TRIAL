package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateCourse(c *gin.Context) {
	var body models.Course

	userID := c.GetUint("user_id")
	roleID := c.GetUint("role_id")

	if roleID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya admin yang boleh membuat mata kuliah"})
		return
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.StartTime != "" {
		if _, err := time.Parse("15:04", body.StartTime); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format start_time harus HH:mm"})
			return
		}
	}

	if body.EndTime != "" {
		if _, err := time.Parse("15:04", body.EndTime); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format end_time harus HH:mm"})
			return
		}
	}

	body.AdminID = userID

	if err := config.DB.Create(&body).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal dalam membuat Mata Kuliah"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mata Kuliah Berhasil Dibuat",
		"data":    body,
	})
}

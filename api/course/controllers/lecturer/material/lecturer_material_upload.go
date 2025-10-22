package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UploadMaterial(c *gin.Context) {
	roleID := c.GetUint("role_id")
	if roleID != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya lecturer yang boleh upload material"})
		return
	}

	lecturerID := c.GetUint("user_id")

	var input models.Material
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Title == "" || input.CourseID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title dan CourseID wajib diisi"})
		return
	}

	var course models.Course
	if err := config.DB.First(&course, "id_course = ?", input.CourseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course tidak ditemukan"})
		return
	}

	if course.LecturerID != lecturerID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Kamu tidak punya akses untuk upload material ke course ini"})
		return
	}

	newMaterial := models.Material{
		Title:       input.Title,
		Description: input.Description,
		FileURL:     input.FileURL,
		CourseID:    input.CourseID,
	}

	if err := config.DB.Create(&newMaterial).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal upload material"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Material berhasil diupload",
		"data":    newMaterial,
	})
}

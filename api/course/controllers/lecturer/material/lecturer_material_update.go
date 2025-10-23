package material

import (
	"course-service/config"
	"course-service/models"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateMaterial(c *gin.Context) {
	roleID := c.GetUint("role_id")
	userID := c.GetUint("user_id")

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

	if course.LecturerID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Kamu tidak punya akses untuk mengubah material dari course ini"})
		return
	}

	if title := c.PostForm("title"); title != "" {
		material.Title = title
	}
	if description := c.PostForm("description"); description != "" {
		material.Description = description
	}

	file, err := c.FormFile("file_url")
	if err == nil {
		f, err := file.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Gagal membaca file yang diupload"})
			return
		}
		defer f.Close()

		fileBytes, err := io.ReadAll(f)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membaca isi file"})
			return
		}

		material.FileURL = fileBytes
		material.FileType = file.Header.Get("Content-Type")
	}

	if err := config.DB.Save(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui material"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Material berhasil diperbarui",
		"data": gin.H{
			"id_material": material.IDMaterial,
			"title":       material.Title,
			"description": material.Description,
			"file_type":   material.FileType,
			"file_url":    material.FileURL,
		},
	})
}

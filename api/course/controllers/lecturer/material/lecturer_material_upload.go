package material

import (
	"course-service/config"
	"course-service/models"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func UploadMaterial(c *gin.Context) {
	userID := c.GetUint("user_id")
	roleID := c.GetUint("role_id")

	if roleID != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya dosen yang boleh menambahkan material"})
		return
	}

	courseID, err := strconv.Atoi(c.PostForm("courseId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "courseId tidak valid"})
		return
	}

	var course models.Course
	if err := config.DB.First(&course, "id_course = ? AND lecturerId = ?", courseID, userID).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Kamu tidak memiliki akses ke course ini"})
		return
	}

	title := c.PostForm("title")
	description := c.PostForm("description")

	var fileBytes []byte
	var fileType string

	file, err := c.FormFile("file_url")
	if err == nil {
		f, err := file.Open()
		if err == nil {
			defer f.Close()
			fileBytes, _ = io.ReadAll(f)
			fileType = file.Header.Get("Content-Type")
		}
	}

	material := models.Material{
		CourseID:    uint(courseID),
		Title:       title,
		Description: description,
		FileURL:     fileBytes,
		FileType:    fileType,
		CreatedAt:   time.Now(),
	}

	if err := config.DB.Create(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan material"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Material berhasil dibuat",
		"data":    material,
	})
}

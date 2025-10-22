package material

import (
	"course-service/config"
	"course-service/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
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

	form, err := c.MultipartForm()
	var savedPaths []string
	var lastFileType string

	if err == nil && form.File != nil {
		files := form.File["file_url"]
		if len(files) > 0 {
			if _, err := os.Stat("uploads"); os.IsNotExist(err) {
				os.Mkdir("uploads", 0755)
			}

			for _, file := range files {
				fileType := file.Header.Get("Content-Type")
				fileName := fmt.Sprintf("%d_%s", time.Now().Unix(), filepath.Base(file.Filename))
				filePath := filepath.Join("uploads", fileName)

				if err := c.SaveUploadedFile(file, filePath); err != nil {
					fmt.Println("❌ Gagal simpan file:", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan file"})
					return
				}

				savedPaths = append(savedPaths, filePath)
				lastFileType = fileType
			}
		}
	}

	fileURLJSON, _ := json.Marshal(savedPaths)

	material := models.Material{
		CourseID:    uint(courseID),
		Title:       title,
		Description: description,
		FileURL:     string(fileURLJSON),
		FileType:    lastFileType,
		CreatedAt:   time.Now(),
	}

	if err := config.DB.Create(&material).Error; err != nil {
		fmt.Println("❌ DB Insert Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat material"})
		return
	}

	var filePaths []string
	_ = json.Unmarshal([]byte(material.FileURL), &filePaths)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Material berhasil dibuat",
		"data": gin.H{
			"id_material": material.IDMaterial,
			"title":       material.Title,
			"description": material.Description,
			"file_paths":  filePaths,
			"file_type":   material.FileType,
			"created_at":  material.CreatedAt,
		},
	})
}

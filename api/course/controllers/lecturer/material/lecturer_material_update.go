package material

import (
	"course-service/config"
	"course-service/models"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

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

	title := c.PostForm("title")
	description := c.PostForm("description")

	if title != "" {
		material.Title = title
	}
	if description != "" {
		material.Description = description
	}

	form, err := c.MultipartForm()
	if err == nil && form.File != nil {
		files := form.File["file_url"]
		if len(files) > 0 {
			var savedPaths []string
			var lastFileType string

			if _, err := os.Stat("uploads"); os.IsNotExist(err) {
				os.Mkdir("uploads", 0755)
			}

			for _, file := range files {
				fileType := file.Header.Get("Content-Type")
				fileName := fmt.Sprintf("%d_%s", time.Now().Unix(), filepath.Base(file.Filename))
				filePath := filepath.Join("uploads", fileName)

				if err := c.SaveUploadedFile(file, filePath); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan file"})
					return
				}

				savedPaths = append(savedPaths, filePath)
				lastFileType = fileType
			}

			pathsJSON, _ := json.Marshal(savedPaths)
			material.FileURL = string(pathsJSON)
			material.FileType = lastFileType
		}
	}

	if err := config.DB.Save(&material).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui material"})
		return
	}

	var filePaths []string
	_ = json.Unmarshal([]byte(material.FileURL), &filePaths)

	c.JSON(http.StatusOK, gin.H{
		"message": "Material berhasil diperbarui",
		"data": gin.H{
			"id_material": material.IDMaterial,
			"title":       material.Title,
			"description": material.Description,
			"file_paths":  filePaths,
			"file_type":   material.FileType,
		},
	})
}

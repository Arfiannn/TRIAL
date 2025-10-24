package controllers

import (
	"io"
	"net/http"
	"operational_service/config"
	"operational_service/models"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateAssignment(c *gin.Context) {
	userID := c.GetUint("user_id")
	roleID := c.GetUint("role_id")

	if roleID != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya dosen yang bisa membuat tugas"})
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
	deadlineStr := strings.TrimSpace(c.PostForm("deadline"))

	if title == "" || description == "" || deadlineStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Semua field wajib diisi"})
		return
	}

	loc, err := time.LoadLocation("Asia/Makassar")
	if err != nil {
		loc = time.UTC
	}

	if len(deadlineStr) == len("2006-01-02") {
		deadlineStr += " 23:59:00"
	}

	deadline, err := time.ParseInLocation("2006-01-02 15:04:05", deadlineStr, loc)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format deadline salah. Gunakan YYYY-MM-DD atau YYYY-MM-DD HH:mm:ss"})
		return
	}

	// ✅ Handle file upload
	file, err := c.FormFile("file_url")
	var fileBytes []byte
	var fileType string
	if err == nil && file != nil {
		openedFile, err := file.Open()
		if err == nil {
			defer openedFile.Close()
			fileBytes, _ = io.ReadAll(openedFile)
			fileType = file.Header.Get("Content-Type")
		}
	}

	assignment := models.Assignment{
		CourseID:    uint(courseID),
		Title:       title,
		Description: description,
		Deadline:    deadline,
		FileURL:     fileBytes,
		FileType:    fileType,
		CreatedAt:   time.Now(),
	}

	if err := config.DB.Create(&assignment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat tugas"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Tugas berhasil dibuat",
		"data":    assignment,
	})
}

func GetAllAssignments(c *gin.Context) {
	var assignments []models.Assignment
	if err := config.DB.Find(&assignments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch assignments"})
		return
	}

	c.JSON(http.StatusOK, assignments)
}

func GetAssignmentByID(c *gin.Context) {
	id := c.Param("id")
	var assignment models.Assignment
	if err := config.DB.First(&assignment, "id_assignment = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}
	c.JSON(http.StatusOK, assignment)
}

func UpdateAssignment(c *gin.Context) {
	if c.GetUint("role_id") != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya dosen yang bisa mengedit tugas"})
		return
	}

	id := c.Param("id")
	var assignment models.Assignment
	if err := config.DB.First(&assignment, "id_assignment = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment tidak ditemukan"})
		return
	}

	title := strings.TrimSpace(c.PostForm("title"))
	description := strings.TrimSpace(c.PostForm("description"))
	deadlineStr := strings.TrimSpace(c.PostForm("deadline"))

	if title != "" {
		assignment.Title = title
	}
	if description != "" {
		assignment.Description = description
	}
	if deadlineStr != "" {
		loc, err := time.LoadLocation("Asia/Makassar")
		if err != nil {
			loc = time.UTC
		}
		if len(deadlineStr) == len("2006-01-02") {
			deadlineStr += " 23:59:00"
		}
		if d, err := time.ParseInLocation("2006-01-02 15:04:05", deadlineStr, loc); err == nil {
			assignment.Deadline = d
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format deadline salah"})
			return
		}
	}

	file, err := c.FormFile("file_url")
	if err == nil && file != nil {
		f, err := file.Open()
		if err == nil {
			defer f.Close()
			fileBytes, _ := io.ReadAll(f)
			assignment.FileURL = fileBytes
			assignment.FileType = file.Header.Get("Content-Type")
		}
	}

	if err := config.DB.Save(&assignment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui assignment"})
		return
	}

	c.JSON(http.StatusOK, assignment)
}

func DeleteAssignment(c *gin.Context) {
	if c.GetUint("role_id") != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only lecturer can delete assignments"})
		return
	}

	id := c.Param("id")
	var assignment models.Assignment
	if err := config.DB.First(&assignment, "id_assignment = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	if err := config.DB.Delete(&assignment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete assignment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Assignment deleted (soft)"})
}

func GetAssignmentFile(c *gin.Context) {
	id := c.Param("id")
	var assignment models.Assignment
	if err := config.DB.First(&assignment, "id_assignment = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	contentType := assignment.FileType
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	c.Header("Content-Disposition", "inline; filename=assignment-file")
	c.Data(http.StatusOK, contentType, assignment.FileURL)
}

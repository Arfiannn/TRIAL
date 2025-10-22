package controllers

import (
	"io"
	"net/http"
	"operational_service/config"
	"operational_service/models"
	"strconv"
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
	deadlineStr := c.PostForm("deadline")

	file, err := c.FormFile("file_url")
	var fileBytes []byte
	var fileType string

	if err == nil {
		openedFile, err := file.Open()
		if err == nil {
			defer openedFile.Close()
			fileBytes, _ = io.ReadAll(openedFile)
			fileType = file.Header.Get("Content-Type")
		}
	}

	loc, _ := time.LoadLocation("Asia/Jakarta")
	deadline, err := time.ParseInLocation("2006-01-02 15:04:05", deadlineStr, loc)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format deadline salah"})
		return
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
	// only lecturer
	if c.GetUint("role_id") != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only lecturer can update assignments"})
		return
	}

	id := c.Param("id")
	var assignment models.Assignment
	if err := config.DB.First(&assignment, "id_assignment = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	title := c.PostForm("title")
	description := c.PostForm("description")
	deadlineStr := c.PostForm("deadline")

	if title != "" {
		assignment.Title = title
	}
	if description != "" {
		assignment.Description = description
	}
	if deadlineStr != "" {
		loc, _ := time.LoadLocation("Asia/Jakarta")
		if d, err := time.ParseInLocation("2006-01-02 15:04:05", deadlineStr, loc); err == nil {
			assignment.Deadline = d
		}
	}

	file, err := c.FormFile("file_url")
	if err == nil {
		f, err := file.Open()
		if err == nil {
			defer f.Close()
			fileBytes, _ := io.ReadAll(f)
			assignment.FileURL = fileBytes
			assignment.FileType = file.Header.Get("Content-Type")
		}
	}

	if err := config.DB.Save(&assignment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update assignment"})
		return
	}

	c.JSON(http.StatusOK, assignment)
}

func DeleteAssignment(c *gin.Context) {
	// only lecturer
	if c.GetUint("role_id") != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only lecturer can delete assignments"})
		return
	}

	id := c.Param("id")
	if err := config.DB.Delete(&models.Assignment{}, "id_assignment = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete assignment"})
		return
	}
	c.Status(http.StatusNoContent)
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

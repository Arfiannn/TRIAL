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
	courseID, _ := strconv.Atoi(c.PostForm("courseId"))
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

	deadline, err := time.Parse("2006-01-02T15:04:05", deadlineStr)
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}

	c.JSON(http.StatusOK, assignments)
}

func GetAssignmentByID(c *gin.Context) {
	id := c.Param("id")
	var assignment models.Assignment

	if err := config.DB.First(&assignment, "id_assignment = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tugas tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, assignment)
}
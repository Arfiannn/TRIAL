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

func CreateSubmission(c *gin.Context) {
	assignmentID, err := strconv.Atoi(c.PostForm("assignmentId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "assignmentId tidak valid"})
		return
	}
	studentID, err := strconv.Atoi(c.PostForm("studentId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "studentId tidak valid"})
		return
	}
	description := c.PostForm("description")
	now := time.Now()

	var assignment models.Assignment
	if err := config.DB.First(&assignment, "id_assignment = ?", assignmentID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Assignment tidak ditemukan"})
		return
	}

	status := "Terkirim"
	if now.After(assignment.Deadline) {
		status = "Terlambat"
	}

	file, err := c.FormFile("file")
	var fileBytes []byte
	var fileType string
	if err == nil {
		f, err := file.Open()
		if err == nil {
			defer f.Close()
			fileBytes, _ = io.ReadAll(f)
			fileType = file.Header.Get("Content-Type")
		}
	}

	sub := models.Submission{
		AssignmentID: uint(assignmentID),
		StudentID:    uint(studentID),
		Description:  description,
		FileURL:      fileBytes,
		FileType:     fileType,
		Status:       status,
		SubmittedAt:  now,
	}

	if err := config.DB.Create(&sub).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat submission"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Tugas berhasil dikumpulkan",
	})
}

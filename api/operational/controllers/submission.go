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

func GetAllSubmission(c *gin.Context) {
	var submissions []models.Submission
	if err := config.DB.Find(&submissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}

	var list []gin.H
	for _, s := range submissions {
		list = append(list, gin.H{
			"id_submission": s.ID,
			"assignmentId":  s.AssignmentID,
			"studentId":     s.StudentID,
			"description":   s.Description,
			"status":        s.Status,
			"submitted_at":  s.SubmittedAt,
			"file_type":     s.FileType,
		})
	}

	c.JSON(http.StatusOK, list)
}

func GetSubmissionByID(c *gin.Context) {
	id := c.Param("id")
	var sub models.Submission
	if err := config.DB.First(&sub, "id_submission = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Submission tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id_submission": sub.ID,
		"assignmentId":  sub.AssignmentID,
		"studentId":     sub.StudentID,
		"description":   sub.Description,
		"status":        sub.Status,
		"submitted_at":  sub.SubmittedAt,
		"file_type":     sub.FileType,
	})
}

func GetSubmissionFile(c *gin.Context) {
	id := c.Param("id")
	var sub models.Submission
	if err := config.DB.First(&sub, "id_submission = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File submission tidak ditemukan"})
		return
	}
	if len(sub.FileURL) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "File kosong"})
		return
	}

	ctype := sub.FileType
	if ctype == "" {
		ctype = "application/octet-stream"
	}

	c.Header("Content-Disposition", "inline")
	c.Data(http.StatusOK, ctype, sub.FileURL)
}

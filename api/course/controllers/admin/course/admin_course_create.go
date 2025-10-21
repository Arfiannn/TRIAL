package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateCourse(c *gin.Context) {
	var body map[string]interface{}
	var course models.Course

	// Jwt Validation
	userID := c.GetUint("user_id")
	roleID := c.GetUint("role_id")

	if roleID != 1 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya admin yang boleh membuat mata kuliah"})
		return
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	course.AdminID = userID
	course.LecturerID = uint(body["lecturerId"].(float64))
	course.MajorID = uint(body["majorId"].(float64))
	course.Semester = body["semester"].(string)
	course.NameCourse = body["namecourse"].(string)
	course.Description = body["description"].(string)
	course.SKS = int(body["sks"].(float64))
	course.Day = body["day"].(string)

	loc := time.UTC

	if startStr, ok := body["start_time"].(string); ok && startStr != "" {
		t, err := time.ParseInLocation("15:04", startStr, loc)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format start_time harus HH:mm"})
			return
		}
		course.StartTime = time.Date(2000, 1, 1, t.Hour(), t.Minute(), 0, 0, loc)
	}

	if endStr, ok := body["end_time"].(string); ok && endStr != "" {
		t, err := time.ParseInLocation("15:04", endStr, loc)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Format end_time harus HH:mm"})
			return
		}
		course.EndTime = time.Date(2000, 1, 1, t.Hour(), t.Minute(), 0, 0, loc)
	}

	if err := config.DB.Create(&course).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal dalam membuat Mata Kuliah"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Mata Kuliah Berhasil Dibuat",
		"data":    course,
	})
}

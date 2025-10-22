package dosen

import (
	"errors"
	"net/http"

	"auth-service/config"
	"auth-service/models"
	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

func RegisterDosen(c *gin.Context) {
	var input struct {
		Name      string `json:"name" binding:"required"`
		Email     string `json:"email" binding:"required,email"`
		Password  string `json:"password" binding:"required,min=6"`
		FacultyID uint   `json:"facultyId" binding:"required"`
		MajorID   uint   `json:"majorId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userCount, pendingCount int64
	config.DB.Model(&models.User{}).Where("email = ?", input.Email).Count(&userCount)
	config.DB.Model(&models.UserPending{}).Where("email = ?", input.Email).Count(&pendingCount)
	if userCount > 0 || pendingCount > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	pending := models.UserPending{
		Name:      input.Name,
		Email:     input.Email,
		Password:  string(hashed),
		RoleID:    2,
		FacultyID: input.FacultyID,
		MajorID:   input.MajorID,
	}

	if err := config.DB.Create(&pending).Error; err != nil {
		var mysqlErr *mysql.MySQLError
		if errors.As(err, &mysqlErr) && mysqlErr.Number == 1062 {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Registration failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registration successful. Awaiting admin approval."})
}
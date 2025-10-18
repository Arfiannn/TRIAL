package dosen

import (
	"errors"
	"net/http"

	"auth-service/models"
	"auth-service/utils"
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

	// 🔍 Cek apakah email sudah ada di user ATAU user_pending
	if exists, _ := models.IsEmailExists(input.Email); exists {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	if err := models.RegisterUserPending(input.Name, input.Email, string(hashed), 2, input.FacultyID, input.MajorID); err != nil {
		// 🔍 Deteksi error duplikat email (MySQL error 1062)
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

func LoginDosen(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := models.GetUserByEmail(input.Email)
	if err != nil || user.RoleID != 2 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials or not a lecturer"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Name, user.Email, user.RoleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token generation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  user,
	})
}
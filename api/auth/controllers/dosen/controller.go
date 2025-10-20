package dosen

import (
	"errors"
	"net/http"

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


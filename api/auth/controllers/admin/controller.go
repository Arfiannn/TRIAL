package admin

import (
	"net/http"

	"auth-service/config"
	"auth-service/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func RegisterAdmin(c *gin.Context) {
	var input struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if exists, _ := models.IsEmailExists(input.Email); exists {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}


	adminUser := models.User{
		Name:      input.Name,
		Email:     input.Email,
		Password:  string(hashedPassword),
		Semester:  0,        
		RoleID:    1,       
		FacultyID: 1,        
		MajorID:   1,        
	}

	if err := config.DB.Create(&adminUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register admin"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Admin registered successfully."})
}


func ApproveUser(c *gin.Context) {
	var input struct {
		PendingID uint `json:"pending_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.ApproveUser(input.PendingID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Approval failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User approved successfully"})
}

func GetPendingUsers(c *gin.Context) {
	pendings, err := models.GetAllPendingUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pending users"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"pending_users": pendings})
}

func GetActiveUsers(c *gin.Context) {
	users, err := models.GetAllActiveUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch active users"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"active_users": users})
}

func DeletePendingUser(c *gin.Context) {
	pendingID := c.Param("id")
	id, err := strconv.ParseUint(pendingID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pending ID"})
		return
	}

	if err := models.DeletePendingUser(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete pending user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pending user deleted successfully"})
}

func DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	id, err := strconv.ParseUint(userID, 10, 32) // ✅ SIMPAN HASILNYA KE `id`
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	if err := config.DB.Unscoped().Delete(&models.User{}, uint(id)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

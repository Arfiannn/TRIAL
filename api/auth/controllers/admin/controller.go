package admin

import (
	"net/http"
	"strconv"

	"auth-service/config"
	"auth-service/models"

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

	var userCount, pendingCount int64
	config.DB.Model(&models.User{}).Where("email = ?", input.Email).Count(&userCount)
	config.DB.Model(&models.UserPending{}).Where("email = ?", input.Email).Count(&pendingCount)
	if userCount > 0 || pendingCount > 0 {
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
		MajorID:   1, // 
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

	var pending models.UserPending
	if err := config.DB.Where("id_pending = ?", input.PendingID).Take(&pending).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Pending user not found"})
		return
	}

	semester := 1
	if pending.RoleID == 2 {
		semester = 0
	}

	user := models.User{
		Name:      pending.Name,
		Email:     pending.Email,
		Password:  pending.Password,
		Semester:  semester,
		RoleID:    pending.RoleID,
		FacultyID: pending.FacultyID,
		MajorID:   pending.MajorID,
	}

	tx := config.DB.Begin()
	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}
	if err := tx.Delete(&pending).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete pending user"})
		return
	}
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "User approved successfully"})
}

func GetPendingUsers(c *gin.Context) {
	var pendings []models.UserPending
	if err := config.DB.Find(&pendings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch pending users"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"pending_users": pendings})
}

func GetActiveUsers(c *gin.Context) {
	var users []models.User
	if err := config.DB.Find(&users).Error; err != nil {
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

	if err := config.DB.Delete(&models.UserPending{}, uint(id)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete pending user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pending user deleted successfully"})
}

func DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	id, err := strconv.ParseUint(userID, 10, 32)
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

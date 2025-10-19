package admin

import (
	"fmt"
	"net/http"

	"auth-service/config"
	"auth-service/models"

	"github.com/gin-gonic/gin"
)

func UpdateUserSemester(c *gin.Context) {
	var id uint
	if _, err := fmt.Sscan(c.Param("id"), &id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var input struct {
		Semester int `json:"semester" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.First(&user, "id_user = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User tidak ditemukan"})
		return
	}

	if user.RoleID != 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ini bukan mahasiswa"})
		return
	}

	user.Semester = input.Semester
	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengupdate semester"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Semester mahasiswa berhasil diupdate",
		"user":    user,
	})
}

package course

import (
	"course-service/config"
	"course-service/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func DeleteCourse(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	config.DB.Delete(&models.Course{}, "id_course = ?", id)
	c.JSON(http.StatusOK, gin.H{"message": "Course deleted"})
}

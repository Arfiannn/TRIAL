package material

import (
	"course-service/config"
	"course-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllMaterials(c *gin.Context) {
	roleID := c.GetUint("role_id")
	if roleID != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya lecturer yang boleh mengakses material"})
		return
	}

	lecturerID := c.GetUint("user_id")

	var courses []models.Course
	if err := config.DB.Where("lecturerId = ?", lecturerID).Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil course"})
		return
	}

	if len(courses) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Anda belum memiliki course"})
		return
	}

	var courseIDs []uint
	for _, course := range courses {
		courseIDs = append(courseIDs, course.IDCourse)
	}

	var materials []models.Material
	if err := config.DB.Where("course_id IN ?", courseIDs).Find(&materials).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil material"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": materials})
}

func GetMaterialByID(c *gin.Context) {
	roleID := c.GetUint("role_id")
	if roleID != 2 {
		c.JSON(http.StatusForbidden, gin.H{"error": "Hanya lecturer yang boleh mengakses material"})
		return
	}

	id := c.Param("id")
	lecturerID := c.GetUint("user_id")

	var material models.Material
	if err := config.DB.First(&material, "id_material = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Material tidak ditemukan"})
		return
	}

	var course models.Course
	if err := config.DB.First(&course, "id_course = ?", material.CourseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Course tidak ditemukan"})
		return
	}

	if course.LecturerID != lecturerID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Anda tidak punya akses ke material ini"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": material})
}

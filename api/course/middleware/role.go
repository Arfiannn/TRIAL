package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RoleOnly(allowedRoles ...uint) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get("role_id")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: no role info"})
			c.Abort()
			return
		}

		userRole := roleVal.(uint)

		for _, role := range allowedRoles {
			if userRole == role {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden: insufficient role"})
		c.Abort()
	}
}

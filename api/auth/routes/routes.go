package routes

import (
	"auth-service/controllers/admin"
	"auth-service/controllers/dosen"
	"auth-service/controllers/mahasiswa"

	"auth-service/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Middleware CORS
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true, // boleh diakses dari port/domain mana saja
		AllowMethods:    []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:    []string{"Origin", "Content-Type", "Accept", "Authorization"},
	}))

	auth := r.Group("/auth")
	{
		auth.POST("/register/mahasiswa", mahasiswa.RegisterMahasiswa)
		auth.POST("/register/dosen", dosen.RegisterDosen)
		auth.POST("/login/mahasiswa", mahasiswa.LoginMahasiswa)
		auth.POST("/login/dosen", dosen.LoginDosen)
		auth.POST("/login/admin", admin.LoginAdmin)
	}

	adminRoutes := r.Group("/admin")
	adminRoutes.Use(middleware.JWTAuthMiddleware())
	{
		adminRoutes.POST("/approve/user", admin.ApproveUser)
		adminRoutes.GET("/users/pending", admin.GetPendingUsers)
		adminRoutes.GET("/users", admin.GetActiveUsers)
		adminRoutes.DELETE("/pending/:id", admin.DeletePendingUser)
		adminRoutes.DELETE("/user/:id", admin.DeleteUser)
	}

	return r
}

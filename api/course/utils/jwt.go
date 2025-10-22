package utils

import (
	"course-service/models"
	"errors"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func ValidateToken(tokenString string) (*models.Validate, error) {
	token, err := jwt.ParseWithClaims(tokenString, &models.Validate{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid or expired token")
	}

	claims, ok := token.Claims.(*models.Validate)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}

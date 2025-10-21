package utils

import (
	"errors"
	"os"

	"course-service/models"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

func ValidateToken(tokenString string) (*models.Validate, error) {
	token, err := jwt.ParseWithClaims(tokenString, &models.Validate{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return nil, errors.New("invalid token")
	}

	if payload, ok := token.Claims.(*models.Validate); ok && token.Valid {
		return payload, nil
	}

	return nil, errors.New("invalid token claims")
}

package utils

import (
	"errors"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type Claims struct {
	ID     uint   `json:"id"`
	Email  string `json:"email"`
	RoleID uint   `json:"roleId"`
	jwt.RegisteredClaims
}

func ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("token tidak valid")
	}
	return token.Claims.(*Claims), nil
}

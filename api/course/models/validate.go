package models

import "github.com/golang-jwt/jwt/v5"

type Validate struct {
	ID        uint   `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	RoleID    uint   `json:"roleId"`
	FacultyID uint   `json:"facultyId"`
	MajorID   uint   `json:"majorId"`
	jwt.RegisteredClaims
}

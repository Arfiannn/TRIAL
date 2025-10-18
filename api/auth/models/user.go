package models

import (
	"auth-service/config"
)

type User struct {
	ID        uint   `gorm:"primaryKey;autoIncrement;column:id_user" json:"id_user"`
	Name      string `gorm:"column:name" json:"name"`
	Email     string `gorm:"column:email;uniqueIndex" json:"email"`
	Password  string `gorm:"column:password" json:"password"`
	Semester  int    `gorm:"column:semester" json:"semester"`
	RoleID    uint   `gorm:"column:roleId" json:"roleId"`
	FacultyID uint   `gorm:"column:facultyId" json:"facultyId"`
	MajorID   uint   `gorm:"column:majorId" json:"majorId"`
}

type UserPending struct {
	ID        uint   `gorm:"primaryKey;autoIncrement;column:id_pending" json:"id_pending"`
	Name      string `gorm:"column:name" json:"name"`
	Email     string `gorm:"column:email" json:"email"`
	Password  string `gorm:"column:password" json:"password"`
	RoleID    uint   `gorm:"column:roleId" json:"roleId"`
	FacultyID uint   `gorm:"column:facultyId" json:"facultyId"`
	MajorID   uint   `gorm:"column:majorId" json:"majorId"`
}

func (User) TableName() string        { return "user" }
func (UserPending) TableName() string { return "user_pending" }

func RegisterUserPending(name, email, password string, roleID, facultyID, majorID uint) error {
	pending := UserPending{
		Name:      name,
		Email:     email,
		Password:  password,
		RoleID:    roleID,
		FacultyID: facultyID,
		MajorID:   majorID,
	}
	return config.DB.Create(&pending).Error
}
package models

import (
	"auth-service/config"
)

type Faculty struct {
	ID   uint   `gorm:"primaryKey;column:id_faculty" json:"id"`
	Name string `gorm:"column:name_faculty" json:"name"`
}


type Major struct {
	ID        uint   `gorm:"primaryKey;column:id_major" json:"id"`
	FacultyID uint   `gorm:"column:facultyId" json:"facultyId"`
	Name      string `gorm:"column:name_major" json:"name"`
}


func (Faculty) TableName() string { return "faculty" }
func (Major) TableName() string   { return "major" }

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

func ApproveUser(pendingID uint) error {
	var pending UserPending
	if err := config.DB.Where("id_pending = ?", pendingID).Take(&pending).Error; err != nil {
		return err
	}

	semester := 1
	if pending.RoleID == 2 {
		semester = 0
	}

	user := User{
		Name:      pending.Name,
		Email:     pending.Email,
		Password:  pending.Password,
		Semester:  semester,
		RoleID:    pending.RoleID,
		FacultyID: pending.FacultyID,
		MajorID:   pending.MajorID,
	}

	tx := config.DB.Begin()
	if err := tx.Create(&user).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Delete(&pending).Error; err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit().Error
}

func GetUserByEmail(email string) (*User, error) {
	var user User
	err := config.DB.Where("email = ?", email).First(&user).Error
	return &user, err
}

func GetAllPendingUsers() ([]UserPending, error) {
	var pendings []UserPending
	err := config.DB.Find(&pendings).Error
	return pendings, err
}

func GetAllActiveUsers() ([]User, error) {
	var users []User
	err := config.DB.Find(&users).Error
	return users, err
}

// Cek apakah email sudah ada di user ATAU user_pending
func IsEmailExists(email string) (bool, error) {

	var userCount int64
	config.DB.Model(&User{}).Where("email = ?", email).Count(&userCount)

	var pendingCount int64
	config.DB.Model(&UserPending{}).Where("email = ?", email).Count(&pendingCount)

	return userCount > 0 || pendingCount > 0, nil
}

func DeletePendingUser(pendingID uint) error {
	return config.DB.Delete(&UserPending{}, pendingID).Error
}


func GetAllFaculties() ([]Faculty, error) {
	var faculties []Faculty
	err := config.DB.Find(&faculties).Error
	return faculties, err
}


func GetAllMajors() ([]Major, error) {
	var majors []Major
	err := config.DB.Find(&majors).Error
	return majors, err
}
package models

type User struct {
	ID        uint   `gorm:"primaryKey;not null;column:id_user"`
	Name      string `gorm:"not null;column:name"`
	Email     string `gorm:"not null;column:email"`
	Password  string `gorm:"not null;column:password"`
	Semester  int    `gorm:"column:semester"`
	RoleID    uint   `gorm:"column:roleId"`
	FacultyID uint   `gorm:"column:facultyId"`
	MajorID   uint   `gorm:"column:majorId"`
}

func (User) TableName() string {
	return "user"
}

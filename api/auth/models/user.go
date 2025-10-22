package models


type Faculty struct {
	ID   uint   `gorm:"primaryKey;column:id_faculty" json:"id_faculty"`
	Name string `gorm:"column:name_faculty" json:"name_faculty"`
}

type Major struct {
	ID        uint   `gorm:"primaryKey;column:id_major" json:"id_major"`
	FacultyID uint   `gorm:"column:facultyId" json:"facultyId"`
	Name      string `gorm:"column:name_major" json:"name_major"`
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


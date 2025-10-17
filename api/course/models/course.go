package models

type Course struct {
	IDCourse    uint   `gorm:"primaryKey;column:id_course"`
	AdminID     uint   `gorm:"not null;column:adminId"`
	LecturerID  uint   `gorm:"not null;column:lecturerId"`
	MajorID     uint   `gorm:"not null;column:majorId"`
	Semester    string `gorm:"not null;column:semester"`
	NameCourse  string `gorm:"not null;column:name_course"`
	Description string `gorm:"not null;column:description"`
	SKS         int    `gorm:"column:sks"`
	Day         string `gorm:"column:day"`
	StartTime   string `gorm:"column:start_time"`
	EndTime     string `gorm:"column:end_time"`

	Admin    User        `gorm:"foreignKey:AdminID;references:IDUser"`
	Lecturer User        `gorm:"foreignKey:LecturerID;references:IDUser"`
	Major    Major       `gorm:"foreignKey:MajorID;references:IDMajor"`
	Material []Material  `gorm:"foreignKey:CourseID;references:IDCourse"` 
}

func (Course) TableName() string {
	return "course"
}

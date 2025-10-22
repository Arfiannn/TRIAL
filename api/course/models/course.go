package models

type Course struct {
	IDCourse    uint   `gorm:"primaryKey;column:id_course" json:"id_course"`
	AdminID     uint   `gorm:"not null;column:adminId" json:"adminId"`
	LecturerID  uint   `gorm:"not null;column:lecturerId" json:"lecturerId"`
	MajorID     uint   `gorm:"not null;column:majorId" json:"majorId"`
	Semester    int    `gorm:"not null;column:semester" json:"semester"`
	NameCourse  string `gorm:"not null;column:name_course" json:"name_course"`
	Description string `gorm:"not null;column:description" json:"description"`
	SKS         int    `gorm:"column:sks" json:"sks"`
	Day         string `gorm:"column:day" json:"day"`
	StartTime   string `gorm:"column:start_time" json:"start_time"`
	EndTime     string `gorm:"column:end_time" json:"end_time"`
}

func (Course) TableName() string {
	return "course"
}

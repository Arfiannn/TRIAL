package models

import "time"

type Material struct {
	IDMaterial  uint      `gorm:"primaryKey;column:id_material" json:"id_material"`
	CourseID    uint      `gorm:"not null;column:courseId" json:"courseId"`
	Title       string    `gorm:"not null;column:title" json:"title"`
	Description string    `gorm:"column:description" json:"description"`
	FileURL     []byte    `gorm:"column:file_url" json:"-"`
	FileType    string    `gorm:"column:file_type" json:"file_type"`
	CreatedAt   time.Time `gorm:"not null;column:created_at" json:"created_at"`
}

func (Material) TableName() string {
	return "material"
}

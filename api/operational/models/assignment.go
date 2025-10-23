package models

import (
	"time"

	"gorm.io/gorm"
)

type Assignment struct {
	ID          uint           `gorm:"primaryKey;column:id_assignment" json:"id_assignment"`
	CourseID    uint           `gorm:"column:courseId" json:"courseId"`
	Title       string         `gorm:"column:title" json:"title"`
	Description string         `gorm:"column:description" json:"description"`
	Deadline    time.Time      `gorm:"column:deadline" json:"deadline"`
	FileURL     []byte         `gorm:"column:file_url" json:"file_url"`
	FileType    string         `gorm:"column:file_type" json:"file_type"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"created_at"`
	DeletedAt   gorm.DeletedAt `gorm:"column:deleted_at" json:"deleted_at"`
}

package models

import "time"

type Submission struct {
	ID           uint      `gorm:"primaryKey;column:id_submission" json:"id_submission"`
	AssignmentID uint      `gorm:"column:assignmentId" json:"assignmentId"`
	StudentID    uint      `gorm:"column:studentId" json:"studentId"`
	Description  string    `gorm:"column:description" json:"description"`
	FileURL      []byte    `gorm:"column:file_url" json:"file_url"`
	FileName     string    `gorm:"column:file_name" json:"file_name"`
	FileType     string    `gorm:"column:file_type" json:"file_type"`
	Status       string    `gorm:"column:status" json:"status"`
	SubmittedAt  time.Time `gorm:"column:submitted_at" json:"submitted_at"`
}

package models

type Material struct {
	IDMaterial   uint   `gorm:"primaryKey;column:id_material"`
	CourseID     uint   `gorm:"not null;column:courseId"`
	Title        string `gorm:"not null;column:title"`
	Description  string `gorm:"column:description"`
	FileURL      string `gorm:"column:file_url"`
	CreatedAt string `gorm:"not null;column:created_at"`

	Course Course `gorm:"foreignKey:CourseID;references:IDCourse"`
}

func (Material) TableName() string {
	return "material"
}

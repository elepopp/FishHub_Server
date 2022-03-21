package model

import (
	. "Fish_Hub/dao"
	"Fish_Hub/utils"
)

type Work struct {
	BaseModel

	Title       string     `form:"title" json:"title" binding:"required" gorm:"size:500"`
	Content     string     `form:"content" json:"content" binding:"required" gorm:"type:longtext"`
	Description string     `form:"description" json:"description" gorm:"size:3000"`
	Price       int        `form:"price" json:"price" binding:"required"`
	Width       int        `form:"width" json:"width"`
	Height      int        `form:"height" json:"height"`
	Display     int        `form:"display" json:"display"`
	Layout      int        `form:"layout" json:"layout"`
	Material    string     `form:"material" json:"material" gorm:"size:120"`
	Birthday    *LocalTime `form:"birthday" json:"birthday" binding:"required"`
	Type        int        `form:"type" json:"type" binding:"required"`
	ImageUrl    string     `form:"image_url" json:"image_url"  binding:"required" gorm:"size:3000"`
	UserId      int        `form:"user_id" json:"user_id" gorm:"not null"`
	SeriesId    int        `form:"series_id" json:"series_id" binding:"required" gorm:"not null"`
	Series      *Series    `json:"series" `
	User        *User      `json:"user"`
}

func ListWork(page int, limit int) (workList []*Work, total int, err error) {

	if err = Db.Find(&workList).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err = Db.Preload("User").Preload("Series").Scopes(utils.Paginate(page, limit)).Order("order_num").Find(&workList).Error; err != nil {
		return nil, 0, err
	}

	return
}

func CreateAWork(work *Work) (err error) {
	err = Db.Create(&work).Error
	return
}

func GetAWork(id string) (work *Work, err error) {
	work = new(Work)
	err = Db.Preload("User").Preload("Series").First(&work, id).Error
	return
}

func DeleteAWork(id string) (err error) {
	err = Db.Where("id=?", id).Delete(&Work{}).Error
	return
}

func UpdateAWork(work *Work) (err error) {
	err = Db.Save(&work).Error
	return
}

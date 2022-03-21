package model

import (
	. "Fish_Hub/dao"
	"Fish_Hub/utils"
)

type Poetry struct {
	BaseModel

	Title       string     `form:"title" json:"title" binding:"required" gorm:"size:500"`
	Type        int        `form:"type" json:"type" binding:"required"`
	Description string     `form:"description" json:"description" gorm:"size:3000"`
	Content     string     `form:"content" json:"content" binding:"required" gorm:"type:longtext"`
	Birthday    *LocalTime `form:"birthday" json:"birthday"  binding:"required"`
	UserId      int        `form:"user_id" json:"user_id" binding:"required" gorm:"not null"`
	User        *User      `json:"user"`
}

func ListPoetry(page int, limit int) (poetrys []*Poetry, total int, err error) {

	if err = Db.Find(&poetrys).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err = Db.Preload("User").Scopes(utils.Paginate(page, limit)).Order("order_num").Find(&poetrys).Error; err != nil {
		return nil, 0, err
	}

	return
}

func CreateAPoetry(poetry *Poetry) (err error) {
	err = Db.Create(&poetry).Error
	return
}

func GetAPoetry(id string) (poetry *Poetry, err error) {
	poetry = new(Poetry)
	err = Db.Preload("User").First(&poetry, id).Error
	return
}

func DeleteAPoetry(id string) (err error) {
	err = Db.Where("id=?", id).Delete(&Poetry{}).Error
	return
}

func UpdateAPoetry(poetry *Poetry) (err error) {
	err = Db.Save(poetry).Error
	return
}

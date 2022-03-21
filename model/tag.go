package model

import (
	. "Fish_Hub/dao"
	"Fish_Hub/utils"
)

type Tag struct {
	BaseModel

	Title    string `form:"title" json:"title" binding:"required" gorm:"size:500"`
	ImageUrl string `form:"image_url" json:"image_url"  binding:"required" gorm:"size:3000"`
	UserId   int    `form:"user_id" json:"user_id"  gorm:"not null"`
	User     *User  `json:"user"  gorm:"PRELOAD:false"`
}

func ListTag(page int, limit int) (TagList []*Tag, total int, err error) {

	if err = Db.Find(&TagList).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err = Db.Preload("Article").Scopes(utils.Paginate(page, limit)).Order("order_num").Preload("User").Find(&TagList).Error; err != nil {
		return nil, 0, err
	}

	return
}

func CreateAtag(tag *Tag) (err error) {
	err = Db.Create(&tag).Error
	return
}

func GetAtag(id string) (tag *Tag, err error) {
	tag = new(Tag)
	err = Db.Preload("User").Preload("Article").First(&tag, id).Error
	return
}

func DeleteAtag(id string) (err error) {
	err = Db.Where("id=?", id).Delete(&Tag{}).Error
	return
}

func UpdateAtag(tag *Tag) (err error) {
	err = Db.Save(&tag).Error
	return
}

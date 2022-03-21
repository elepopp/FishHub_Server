package model

import (
	. "Fish_Hub/dao"
	"Fish_Hub/utils"
)

type Topic struct {
	BaseModel

	Title       string `form:"title" json:"title" binding:"required" gorm:"size:500"`
	Description string `form:"description" json:"description" gorm:"size:3000"`
	ImageUrl    string `form:"image_url" json:"image_url"  binding:"required" gorm:"size:3000"`
	UserId      int    `form:"user_id" json:"user_id"  gorm:"not null"`
	User        *User  `json:"user"  gorm:"PRELOAD:false"`
}

func ListTopic(page int, limit int) (topics []*Topic, total int, err error) {

	if err = Db.Find(&topics).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err = Db.Scopes(utils.Paginate(page, limit)).Order("order_num").Preload("User").Find(&topics).Error; err != nil {
		return nil, 0, err
	}

	return
}

func CreateATopic(topic *Topic) (err error) {
	err = Db.Create(&topic).Error
	return
}

func GetATopic(id string) (topic *Topic, err error) {
	topic = new(Topic)
	err = Db.Preload("User").First(&topic, id).Error
	return
}

func DeleteATopic(id string) (err error) {
	err = Db.Where("id=?", id).Delete(&Topic{}).Error
	return
}

func UpdateATopic(topic *Topic) (err error) {
	err = Db.Save(topic).Error
	return
}

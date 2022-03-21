package model

import (
	. "Fish_Hub/dao"
	"Fish_Hub/utils"
)

type Comment struct {
	BaseModel

	Name    string `form:"name" json:"name" binding:"required" gorm:"size:120"`
	Type    int    `form:"type" json:"type" binding:"required"`
	Email   string `form:"email" json:"email"  binding:"required"  gorm:"size:120"`
	Content string `form:"content" json:"content"   binding:"required"  gorm:"type:longtext"`
	Purpose string `form:"purpose" json:"purpose"  binding:"required"  gorm:"size:120"`
}

func ListComment(page int, limit int) (commentList []*Comment, total int, err error) {

	if err = Db.Find(&commentList).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err = Db.Scopes(utils.Paginate(page, limit)).Order("updated_at desc").Find(&commentList).Error; err != nil {
		return nil, 0, err
	}

	return
}

func CreateAComment(comment *Comment) (err error) {
	err = Db.Create(&comment).Error
	return
}

func GetAComment(id string) (comment *Comment, err error) {
	comment = new(Comment)
	err = Db.First(&comment, id).Error
	return
}

func DeleteAComment(id string) (err error) {
	err = Db.Where("id=?", id).Delete(&Comment{}).Error
	return
}

func UpdateAComment(comment *Comment) (err error) {
	err = Db.Save(comment).Error
	return
}

package model

import (
	. "Fish_Hub/dao"
	"Fish_Hub/utils"
)

type Comment struct {
	BaseModel

	ArticleId int        `form:"article_id" json:"article_id"`
	Content   string     `form:"content" json:"content"   binding:"required"  gorm:"type:longtext"`
	Type      int        `form:"type" json:"type"   gorm:"size:5"`
	LikeNum   int        `form:"like_num" json:"like_num"`
	UserId    int        `form:"user_id" json:"user_id"  gorm:"not null"`
	User      *User      `json:"user"  gorm:"PRELOAD:false"`
	CommentId int        `form:"comment_id" json:"comment_id"`
	ReplyId   int        `form:"reply_id" json:"reply_id"`
	Reply     *User      `form:"reply" json:"reply"`
	Comment   []*Comment `json:"comment"  gorm:"PRELOAD:false"`
}

func ListComment(page int, limit int) (commentList []*Comment, total int, err error) {

	if err = Db.Find(&commentList).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err = Db.Order("updated_at desc").Scopes(utils.Paginate(page, limit)).Preload("Reply").Preload("User").Preload("Comment").Find(&commentList).Error; err != nil {
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

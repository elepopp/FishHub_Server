package model

import (
	. "Fish_Hub/dao"
	"Fish_Hub/utils"
)

type Article struct {
	BaseModel

	Title       string `form:"title" json:"title" binding:"required" gorm:"size:500"`
	Type        int    `form:"type" json:"type"  binding:"required"`
	Description string `form:"description" json:"description" gorm:"size:3000"`
	Content     string `form:"content" json:"content" gorm:"type:longtext"`
	Cover       string `form:"cover" json:"cover" gorm:"size:3000"`
	UserId      int    `form:"user_id" json:"user_id"  gorm:"not null"`
	User        *User  `json:"user"  gorm:"PRELOAD:false"`
}

func ListArticle(page int, limit int) (articleList []*Article, total int, err error) {

	if err = Db.Find(&articleList).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err = Db.Scopes(utils.Paginate(page, limit)).Order("order_num").Preload("Tag").Preload("User").Find(&articleList).Error; err != nil {
		return nil, 0, err
	}

	return
}

func CreateAArticle(article *Article) (err error) {
	err = Db.Create(&article).Error
	return
}

func GetAArticle(id string) (article *Article, err error) {
	article = new(Article)
	err = Db.Preload("User").First(&article, id).Error
	return
}

func DeleteAArticle(id string) (err error) {
	err = Db.Where("id=?", id).Delete(&Article{}).Error
	return
}

func UpdateAArticle(article *Article) (err error) {
	err = Db.Save(article).Error
	return
}

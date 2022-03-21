package model

import (
	. "Fish_Hub/dao"
	"Fish_Hub/utils"
)

type Series struct {
	BaseModel

	Title       string     `form:"title" json:"title" binding:"required" gorm:"size:500"`
	Type        int        `form:"type" json:"type"  binding:"required"`
	Description string     `form:"description" json:"description" gorm:"size:3000"`
	Price       int        `form:"price" json:"price"`
	Material    string     `form:"material" json:"material" gorm:"size:120"`
	Birthday    *LocalTime `form:"birthday" json:"birthday"  binding:"required"`
	Cover       string     `form:"cover" json:"cover" gorm:"size:3000"`
	UserId      int        `form:"user_id" json:"user_id"  gorm:"not null"`
	User        *User      `json:"user"  gorm:"PRELOAD:false"`
	Work        []*Work    `json:"work"  gorm:"PRELOAD:false"`
}

func ListSeries(page int, limit int) (seriesList []*Series, total int, err error) {

	if err = Db.Find(&seriesList).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err = Db.Scopes(utils.Paginate(page, limit)).Order("order_num").Preload("Work").Preload("User").Find(&seriesList).Error; err != nil {
		return nil, 0, err
	}

	return
}

func CreateASeries(series *Series) (err error) {
	err = Db.Create(&series).Error
	return
}

func GetASeries(id string) (series *Series, err error) {
	series = new(Series)
	err = Db.Preload("User").First(&series, id).Error
	return
}

func DeleteASeries(id string) (err error) {
	err = Db.Where("id=?", id).Delete(&Series{}).Error
	return
}

func UpdateASeries(series *Series) (err error) {
	err = Db.Save(series).Error
	return
}

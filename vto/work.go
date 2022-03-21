package vto

import (
	"Fish_Hub/model"
)

// Title       string     `form:"title" json:"title" binding:"required" gorm:"size:500"`
// Content     string     `form:"content" json:"content" binding:"required" gorm:"type:longtext"`
// Description string     `form:"description" json:"description" gorm:"size:3000"`
// Price       int        `form:"price" json:"price" binding:"required"`
// Width       int        `form:"width" json:"width"`
// Height      int        `form:"height" json:"height"`
// Display     int        `form:"display" json:"display"`
// Layout      int        `form:"layout" json:"layout"`
// Material    string     `form:"material" json:"material" gorm:"size:120"`
// Birthday    *LocalTime `form:"birthday" json:"birthday" binding:"required"`
// Type        int        `form:"type" json:"type" binding:"required"`
// ImageUrl    string     `form:"image_url" json:"image_url"  binding:"required" gorm:"size:3000"`
// UserId      int        `form:"user_id" json:"user_id" gorm:"not null"`
// SeriesId    int        `form:"series_id" json:"series_id" binding:"required" gorm:"not null"`
// Series      *Series    `json:"series" `
// User        *User      `json:"user"`

func WorkVto(work model.Work) (err string) {
	if work.Title == "" {
		return "标题不能为空"
	}
	if len(work.Title) > 500 {
		return "简介不能超过500个字符"
	}
	if work.Content == "" {
		return "简介不能为空"
	}
	if len(work.Content) > 2000 {
		return "简介不能超过2000个字符"
	}
	if work.Type == 0 {
		return "请设置作品类型"
	}
	if work.Price == 0 {
		return "价格不能为 0"
	}
	if work.Width == 0 {
		return "宽度未设置"
	}
	if work.Height == 0 {
		return "高度未设置"
	}
	if work.ImageUrl == "" {
		return "请上传图片"
	}
	if len(work.ImageUrl) > 2000 {
		return "图片链接不能超过2000个字符"
	}
	if work.SeriesId == 0 {
		return "系列未选择"
	}
	if work.Birthday == nil {
		return "日期格式错误"
	}
	return ""
}

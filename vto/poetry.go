package vto

import (
	"Fish_Hub/model"
)

func PoetryVto(poetry model.Poetry) (err string) {
	// Title       string     `form:"title" json:"title" binding:"required" gorm:"size:500"`
	// Type        int        `form:"type" json:"type" binding:"required"`
	// Description string     `form:"description" json:"description" gorm:"size:3000"`
	// Content     string     `form:"content" json:"content" binding:"required" gorm:"type:longtext"`
	// Birthday    *LocalTime `form:"birthday" json:"birthday"  binding:"required"`
	// UserId      int        `form:"user_id" json:"user_id" binding:"required" gorm:"not null"`
	// User        *User      `json:"user"`

	if poetry.Title == "" {
		return "标题不能为空"
	}
	if len(poetry.Title) > 500 {
		return "标题不能超过500个字符"
	}
	if poetry.Content == "" {
		return "内容不能为空"
	}
	if len(poetry.Content) > 2000 {
		return "标题不能超过2000个字符"
	}
	if poetry.Type == 0 {
		return "请设置诗的类型"
	}
	if poetry.Birthday == nil {
		return "时间格式错误"
	}
	return ""
}

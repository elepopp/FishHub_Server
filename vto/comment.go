package vto

import (
	"Fish_Hub/model"
)

func CommentVto(comment model.Comment) (err string) {
	// BaseModel

	// Name    string `form:"name" json:"name" binding:"required" gorm:"size:120"`
	// Type    int    `form:"type" json:"type" binding:"required"`
	// Email   string `form:"email" json:"email"  binding:"required"  gorm:"size:120"`
	// Content string `form:"content" json:"content"   binding:"required"  gorm:"type:longtext"`
	// Purpose string `form:"purpose" json:"purpose"  binding:"required"  gorm:"size:120"`

	if comment.Name == "" {
		return "名称不能为空"
	}
	if comment.Content == "" {
		return "内容不能为空"
	}

	if len(comment.Name) > 500 {
		return "标题不能超过500个字符"
	}

	if len(comment.Content) > 2000 {
		return "标题不能超过2000个字符"
	}

	if comment.Type == 0 {
		return "请设置评论的类型"
	}
	if comment.Email == "" {
		return "名称不能为空"
	}
	return ""
}

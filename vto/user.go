package vto

import (
	"Fish_Hub/model"
)

// Name        string     `form:"name" json:"name" gorm:"size:120"`
// Avatar      string     `form:"avatar" json:"avatar" gorm:"size:3000"`
// Description string     `form:"description" json:"description"  gorm:"type:longtext"`
// Birthday    *LocalTime `form:"birthday" json:"birthday"`
// Realname    string     `form:"realname" json:"realname" gorm:"size:120"`
// Nickname    string     `form:"nickname" json:"nickname" gorm:"size:120"`
// Username    string     `form:"username" json:"username"  gorm:"size:120"`
// Password    string     `form:"password" json:"-"  gorm:"size:120"`
// Phone       string     `form:"phone" json:"phone"  gorm:"size:120"`
// Email       string     `form:"email" json:"email" gorm:"size:120"`
// Facebook    string     `form:"facebook" json:"facebook"   gorm:"size:3000"`

func UserVto(user model.User) (err string) {

	if user.Nickname == "" {
		return "昵称不能为空"
	}
	if len(user.Nickname) > 120 {
		return "标题不能超过120个字符"
	}
	if user.Description == "" {
		return "简介不能为空"
	}
	if len(user.Description) > 5000 {
		return "简介不能超过5000个字符"
	}
	return ""
}

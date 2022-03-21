package vto

import (
	"Fish_Hub/model"
)

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

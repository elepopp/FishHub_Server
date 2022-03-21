package vto

import "Fish_Hub/model"

func TagVto(tag model.Tag) (err string) {

	if tag.Title == "" {
		return "标题不能为空"
	}
	if len(tag.Title) > 500 {
		return "简介不能超过500个字符"
	}
	if tag.ImageUrl == "" {
		return "请上传图片"
	}
	if len(tag.ImageUrl) > 2000 {
		return "图片链接不能超过2000个字符"
	}

	return ""
}

package vto

import (
	"Fish_Hub/model"
)

func CommentVto(comment model.Comment) (err string) {

	if comment.Content == "" {
		return "内容不能为空"
	}

	if len(comment.Content) > 2000 {
		return "标题不能超过2000个字符"
	}

	if comment.Type == 0 {
		return "请设置评论的类型"
	}

	return ""
}

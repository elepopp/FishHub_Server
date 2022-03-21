package vto

import (
	"Fish_Hub/model"
)

func ArticleVto(article model.Article) (err string) {
	if article.Title == "" {
		return "标题不能为空"
	}
	if len(article.Title) > 500 {
		return "标题不能超过500个字符"
	}
	if article.Type == 0 {
		return "请设置系列类型"
	}

	return ""
}

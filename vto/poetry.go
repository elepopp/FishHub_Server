package vto

import (
	"Fish_Hub/model"
)

func TopicVto(topic model.Topic) (err string) {

	if topic.Title == "" {
		return "标题不能为空"
	}
	if len(topic.Title) > 500 {
		return "标题不能超过500个字符"
	}

	return ""
}

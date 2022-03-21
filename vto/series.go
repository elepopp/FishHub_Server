package vto

import (
	"Fish_Hub/model"
)

func SeriesVto(series model.Series) (err string) {
	if series.Title == "" {
		return "标题不能为空"
	}
	if len(series.Title) > 500 {
		return "标题不能超过500个字符"
	}
	if series.Type == 0 {
		return "请设置系列类型"
	}
	if series.Birthday == nil {
		return "请设置创作时间"
	}
	return ""
}

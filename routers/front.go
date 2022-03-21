package routers

import (
	"Fish_Hub/controller"

	"github.com/gin-gonic/gin"
)

// 前台路由
func Front(r *gin.Engine) {
	front := r.Group("front")
	{
		front.GET("/series/list", controller.ListSeries)
		front.GET("/series/:id", controller.GetASeries)

		front.GET("/poetry/list", controller.ListSeries)
		front.GET("/poetry/:id", controller.GetAPoetry)

		front.POST("/comment", controller.CreateAComment)
	}

}

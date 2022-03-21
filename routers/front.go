package routers

import (
	"Fish_Hub/controller"

	"github.com/gin-gonic/gin"
)

// 前台路由
func Front(r *gin.Engine) {
	front := r.Group("front")
	{
		front.GET("/article/list", controller.ListArticle)
		front.GET("/article/:id", controller.GetAArticle)

		front.GET("/topic/list", controller.ListArticle)
		front.GET("/topic/:id", controller.GetATopic)

		front.POST("/comment", controller.CreateAComment)
	}

}

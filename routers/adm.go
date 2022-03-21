package routers

import (
	"Fish_Hub/controller"

	"github.com/gin-gonic/gin"
)

func Adm(r *gin.Engine) {
	adm := r.Group("adm")

	{

		adm.GET("/user", controller.GetAUser)
		adm.PUT("/user", controller.UpdateAUser)

		adm.GET("/article/list", controller.ListArticle)
		adm.POST("/article", controller.CreateAArticle)
		adm.PUT("/article/:id", controller.UpdateAArticle)
		adm.GET("/article/:id", controller.GetAArticle)
		adm.DELETE("/article/:id", controller.DeleteAArticle)

		adm.GET("/topic/list", controller.ListTopic)
		adm.POST("/topic", controller.CreateATopic)
		adm.PUT("/topic/:id", controller.UpdateATopic)
		adm.GET("/topic/:id", controller.GetATopic)
		adm.DELETE("/topic/:id", controller.DeleteATopic)

		adm.GET("/tag/list", controller.ListTag)
		adm.POST("/tag", controller.CreateATag)
		adm.PUT("/tag/:id", controller.UpdateATag)
		adm.GET("/tag/:id", controller.GetATag)
		adm.DELETE("/tag/:id", controller.DeleteATag)

		adm.GET("/comment/list", controller.ListComment)
	}
}

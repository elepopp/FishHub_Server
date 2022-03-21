package routers

import (
	"Fish_Hub/controller"
	"Fish_Hub/rsp"
	"Fish_Hub/setting"
	"net/http"

	"github.com/gin-gonic/gin"
)

// 初始化路由
func InitRouter() *gin.Engine {
	if setting.Conf.Release {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()
	// 未找到路由
	r.NoMethod(HandleNotFound)
	r.NoRoute(HandleNotFound)

	// 不需要登录的路由
	r.GET("/wxlogin/", controller.WxLogin)

	r.GET("/front/article/list", controller.ListArticle)
	r.GET("/front/article/:id", controller.GetAArticle)
	r.GET("/front/topic/list", controller.ListArticle)
	r.GET("/front/topic/:id", controller.GetATopic)
	r.POST("/front/comment", controller.CreateAComment)
	// 以上的接口，不需要Authorize()中间件身份验证;
	r.Use(controller.Authorize())
	// 以下的接口，都使用Authorize()中间件身份验证;
	// ····
	// 运营端
	Adm(r)

	return r
}

// 未找到路由
func HandleNotFound(c *gin.Context) {
	c.JSON(http.StatusOK, rsp.NotFound.WithData("未找到"))
	return
}

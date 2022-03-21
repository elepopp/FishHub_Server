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

	r.NoMethod(HandleNotFound)
	r.NoRoute(HandleNotFound)

	Auth(r)
	Front(r)
	r.Use(controller.Authorize()) //以下的接口，都使用Authorize()中间件身份验证;以上的接口，不需要Authorize()中间件身份验证
	Adm(r)

	return r
}

// 未找到路由
func HandleNotFound(c *gin.Context) {
	c.JSON(http.StatusOK, rsp.NotFound.WithData("未找到"))
	return
}

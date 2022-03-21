package routers

import (
	"Fish_Hub/controller"

	"github.com/gin-gonic/gin"
)

// 前台路由
func Auth(r *gin.Engine) {

	r.POST("/adm/login", controller.Login)
	r.POST("/adm/regsiter", controller.Regsiter)

}

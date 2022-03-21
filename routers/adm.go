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

		adm.GET("/series/list", controller.ListSeries)
		adm.POST("/series", controller.CreateASeries)
		adm.PUT("/series/:id", controller.UpdateASeries)
		adm.GET("/series/:id", controller.GetASeries)
		adm.DELETE("/series/:id", controller.DeleteASeries)

		adm.GET("/poetry/list", controller.ListPoetry)
		adm.POST("/poetry", controller.CreateAPoetry)
		adm.PUT("/poetry/:id", controller.UpdateAPoetry)
		adm.GET("/poetry/:id", controller.GetAPoetry)
		adm.DELETE("/poetry/:id", controller.DeleteAPoetry)

		adm.GET("/work/list", controller.ListWork)
		adm.POST("/work", controller.CreateAWork)
		adm.PUT("/work/:id", controller.UpdateAWork)
		adm.GET("/work/:id", controller.GetAWork)
		adm.DELETE("/work/:id", controller.DeleteAWork)

		adm.GET("/comment/list", controller.ListComment)
	}
}

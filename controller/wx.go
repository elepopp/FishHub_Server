package controller

import (
	"Fish_Hub/rsp"
	"Fish_Hub/wx"
	"net/http"

	"github.com/gin-gonic/gin"
)

type WxSign struct {
	Signature string
	Echostr   string
	Timestamp string
	Nonce     string
}

func WxLogin(c *gin.Context) {
	token := wx.GetAccessToken()
	c.JSON(http.StatusOK, rsp.Ok.WithData(token))
}

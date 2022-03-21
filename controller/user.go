package controller

import (
	"Fish_Hub/model"
	"Fish_Hub/rsp"
	"Fish_Hub/vto"
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Author  卢锦涛 Kamtao

// @Title  查询一个用户
func GetAUser(c *gin.Context) {

	user_id := c.GetString("user_id")
	user, err := model.GetAUser(user_id) // => 返回 `true` ，因为主键为空

	if err != nil {
		c.JSON(http.StatusOK, rsp.Err.WithData(err))
		return
	}

	c.JSON(http.StatusOK, rsp.Ok.WithData(user))
}

// @Title  更新一个用户
func UpdateAUser(c *gin.Context) {

	user_id := c.GetString("user_id")

	user, _ := model.GetAUser(user_id)

	c.ShouldBindJSON(&user)
	errMsg := vto.UserVto(*user)

	if errMsg != "" {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData(errMsg))
		return
	}

	if updateErr := model.UpdateAUser(user); updateErr != nil {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData(updateErr.Error()))
		return
	}

	c.JSON(http.StatusOK, rsp.Ok.WithData("更新成功"))
}

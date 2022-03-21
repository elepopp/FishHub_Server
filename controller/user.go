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

func AdmLogin(c *gin.Context) {
	c.Abort()
	var user model.User
	var loginForm model.LoginForm

	// 对应表单和结构体
	if ShouldBindJSONErr := c.ShouldBindJSON(&loginForm); ShouldBindJSONErr != nil {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData(ShouldBindJSONErr.Error()))
		return
	}
	loginErr := model.Login(&loginForm, &user)

	if loginErr != nil {
		c.JSON(http.StatusOK, rsp.LoginErr.WithData(loginErr))
	} else {
		token, GenerateTokenError := GenerateToken(user.ID)
		if GenerateTokenError != nil {
			c.JSON(http.StatusOK, rsp.Err.WithData(GenerateTokenError))
		}
		c.JSON(http.StatusOK, rsp.Ok.WithData(token))
	}
}

func AdmRegsiter(c *gin.Context) {
	c.Abort()
	var user model.User
	var loginForm model.LoginForm

	// 对应表单和结构体
	if ShouldBindJSONErr := c.ShouldBindJSON(&loginForm); ShouldBindJSONErr != nil {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData(ShouldBindJSONErr.Error()))
		return
	}

	if loginForm.Username == "" {
		c.JSON(http.StatusOK, rsp.ErrParam.WithMsg("username 不能为空"))
		return
	}
	if loginForm.Password == "" {
		c.JSON(http.StatusOK, rsp.ErrParam.WithMsg("password 不能为空"))
		return
	}

	model.CheckUsername(loginForm.Username, &user) // => 返回 `true` ，因为主键为空
	if user.ID != 0 {
		c.JSON(http.StatusOK, rsp.Err.WithData("用户已存在"))
		return
	}

	RegErr := model.Regsiger(&loginForm, &user) // => 返回 `true` ，因为主键为空
	if RegErr != nil {
		c.JSON(http.StatusOK, rsp.Err.WithData(RegErr))
	} else {
		token, GenerateTokenError := GenerateToken(user.ID)
		if GenerateTokenError != nil {
			c.JSON(http.StatusOK, rsp.LoginErr.WithData(GenerateTokenError))
		}
		c.JSON(http.StatusOK, rsp.Ok.WithData(token))
	}
}

package controller

import (
	"Fish_Hub/model"
	"Fish_Hub/rsp"
	"Fish_Hub/vto"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// @Author  卢锦涛 Kamtao

// @Title  系列列表

func ListTag(c *gin.Context) {
	c.Abort()

	page, pageErr := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, limitErr := strconv.Atoi(c.DefaultQuery("limit", "20"))

	if limitErr != nil {
		c.JSON(http.StatusOK, rsp.Err.WithMsg("查询参数错误 limit"))
		return
	}

	if pageErr != nil {
		c.JSON(http.StatusOK, rsp.Err.WithMsg("查询参数错误 page"))
		return
	}

	list, total, ListErr := model.ListTag(page, limit)

	if ListErr != nil {
		c.JSON(http.StatusOK, rsp.Err.WithMsg(ListErr.Error()))
		return
	}
	c.JSON(http.StatusOK, rsp.Ok.WithList(list, total))
}

// @Title  创建一个系列

func CreateATag(c *gin.Context) {
	var tag model.Tag

	// 对应表单和结构体

	user_id, atoiErr := strconv.Atoi(c.GetString("user_id"))
	if atoiErr != nil {
		c.JSON(http.StatusOK, rsp.Err.WithMsg("user_id 转换错误"))
		return
	}
	tag.UserId = user_id

	c.ShouldBindJSON(&tag)
	errMsg := vto.TagVto(tag)

	if errMsg != "" {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData(errMsg))
		return
	}

	// 创建
	CreateErr := model.CreateAtag(&tag)

	if CreateErr != nil {
		c.JSON(http.StatusOK, rsp.Err.WithData(CreateErr.Error()))
		return
	}

	c.JSON(http.StatusOK, rsp.Ok.WithData(tag))

}

// @Title  查询一个系列

func GetATag(c *gin.Context) {

	id, ok := c.Params.Get("id")
	if !ok || id == ":id" {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData("无效的id"))
		return
	}

	tag, err := model.GetAArticle(id) // => 返回 `true` ，因为主键为空

	if err != nil {
		c.JSON(http.StatusOK, rsp.Err.WithData(err))
		return
	}

	c.JSON(http.StatusOK, rsp.Ok.WithData(tag))
}

// @Title  更新一个系列
func UpdateATag(c *gin.Context) {

	id, ok := c.Params.Get("id")
	if !ok || id == ":id" {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData("无效的id"))
		return
	}

	tag, _ := model.GetAtag(id)

	c.ShouldBindJSON(&tag)
	errMsg := vto.TagVto(*tag)

	if errMsg != "" {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData(errMsg))
		return
	}

	if updateErr := model.UpdateAtag(tag); updateErr != nil {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData(updateErr.Error()))
		return
	}

	c.JSON(http.StatusOK, rsp.Ok.WithData("更新成功"))
}

// @Title  删除一个系列

func DeleteATag(c *gin.Context) {

	id, ok := c.Params.Get("id")
	if !ok || id == ":id" {
		c.JSON(http.StatusOK, rsp.ErrParam.WithData("无效的id"))
		return
	}

	if DeleteErr := model.DeleteAtag(id); DeleteErr != nil {
		c.JSON(http.StatusOK, rsp.Err.WithData(DeleteErr.Error()))
	}

	c.JSON(http.StatusOK, rsp.Ok.WithData("删除成功"))
}

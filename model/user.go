package model

import (
	. "Fish_Hub/dao"
)

// 这里处理 Password 暴露问题
type LoginForm struct {
	Username string `form:"username" json:"username"`
	Password string `form:"password" json:"password"`
}

type User struct {
	BaseModel

	Name        string     `form:"name" json:"name" gorm:"size:120"`
	Avatar      string     `form:"avatar" json:"avatar" gorm:"size:3000"`
	Description string     `form:"description" json:"description"  gorm:"type:longtext"`
	Birthday    *LocalTime `form:"birthday" json:"birthday"`
	Realname    string     `form:"realname" json:"realname" gorm:"size:120"`
	Nickname    string     `form:"nickname" json:"nickname" gorm:"size:120"`
	Username    string     `form:"username" json:"username"  gorm:"size:120"`
	Password    string     `form:"password" json:"-"  gorm:"size:120"`
	Phone       string     `form:"phone" json:"phone"  gorm:"size:120"`
	Email       string     `form:"email" json:"email" gorm:"size:120"`
	Blog        string     `form:"facebook" json:"facebook"   gorm:"size:3000"`
	Gender      int        `form:"gender" json:"gender"   gorm:"size:1"`
	Location    string     `form:"location" json:"location"   gorm:"size:500"`
	School      string     `form:"school" json:"school"   gorm:"size:500"`
	Type        int        `form:"type" json:"type"   gorm:"size:5"`
	Status      int        `form:"status" json:"status"   gorm:"size:5"`
	Company     string     `form:"company" json:"company"   gorm:"size:500"`
	WxOpenid    string     `form:"wx_openid" json:"wx_openid"   gorm:"size:500"`

	LikeNum    int `form:"like_num" json:"like_num" `
	CommentNum int `form:"comment_num" json:"comment_num"`
	ArticleNum int `form:"article_num" json:"article_num"`
}

// 登录
func Login(loginForm *LoginForm, user *User) (err error) {
	err = Db.Where("username = ? and password=?", loginForm.Username, loginForm.Password).First(&user).Error
	return
}

// 检查用户名是否被注册
func CheckUsername(username string, user *User) (err error) {
	err = Db.Where("username = ?", username).First(&user).Error
	return
}

// 用户注册
func Regsiger(loginForm *LoginForm, user *User) (err error) {
	user.Username = loginForm.Username
	user.Password = loginForm.Password
	err = Db.Create(&user).Error
	return
}

func GetAUser(id string) (user *User, err error) {
	user = new(User)
	err = Db.First(&user, id).Error
	return
}

func UpdateAUser(user *User) (err error) {
	err = Db.Save(user).Error
	return
}

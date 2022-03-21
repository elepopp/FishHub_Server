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
	Facebook    string     `form:"facebook" json:"facebook"   gorm:"size:3000"`
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

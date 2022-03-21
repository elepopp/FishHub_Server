package setting

import (
	"gopkg.in/ini.v1"
)

var Conf = new(AppConfig)

// AppConfig 应用程序配置
type AppConfig struct {
	Release       bool `ini:"release"`
	Port          int  `ini:"port"`
	*MySQLConfig  `ini:"mysql"`
	*LoginConfig  `ini:"login"`
	*WechatConfig `ini:"wechat"`
}

// MySQLConfig 数据库配置
type MySQLConfig struct {
	User     string `ini:"user"`
	Password string `ini:"password"`
	DB       string `ini:"db"`
	Host     string `ini:"host"`
	Port     int    `ini:"port"`
}

// Login 配置
type LoginConfig struct {
	Wechat   bool `ini:"wechat"`
	Email    bool `ini:"email"`
	Username bool `ini:"username"`
	Github   bool `ini:"github"`
}

// WeChat 配置
type WechatConfig struct {
	AppId     string `ini:"app_id"`
	AppSecret string `ini:"app_secret"`
	AppToken  string `ini:"app_token"`
}

func Init(file string) error {
	return ini.MapTo(Conf, file)
}

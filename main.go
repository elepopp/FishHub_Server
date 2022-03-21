package main

import (
	"Fish_Hub/dao"
	"Fish_Hub/model"
	"Fish_Hub/routers"
	"Fish_Hub/setting"
	"fmt"
	"os"
)

func main() {

	// 用第二个参数 配置路径
	if len(os.Args) < 2 {
		fmt.Println("Usage：./Geek_Go conf/config.ini")
		return
	}

	// 加载配置文件
	if err := setting.Init(os.Args[1]); err != nil {
		fmt.Printf("load config from file failed, err:%v\n", err)
		return
	} else {
		fmt.Printf("配置文件:%v 加载完成\n", os.Args[1])
	}
	// 创建数据库
	// sql: CREATE DATABASE Geek_Go;
	// 连接数据库
	err := dao.InitMySQL(setting.Conf.MySQLConfig)
	if err != nil {
		fmt.Printf("init mysql failed, err:%v\n", err)
		return
	}
	defer dao.Close() // 程序退出关闭数据库连接

	// 模型绑定
	dao.Db.SingularTable(true)

	// 数据库和结构体一一对应
	dao.Db.AutoMigrate(
		&model.Series{},
		&model.User{},
		&model.Work{},
		&model.Poetry{},
		&model.Comment{},
	)

	// 注册路由
	r := routers.InitRouter()

	if err := r.Run(fmt.Sprintf(":%d", setting.Conf.Port)); err != nil {
		fmt.Printf("server startup failed, err:%v\n", err)
	}
}

package wx

import (
	"Fish_Hub/setting"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

var URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${app_secret}`

type Wx struct {
	AccessToken string `json:"access_token"`
	Errcode     int    `json:"errcode"`
}

// 更新token => 写入文件
func UpdateAccessToken(token *string) (err error) {
	URL := fmt.Sprintf("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%v&secret=%v", setting.Conf.WechatConfig.AppId, setting.Conf.WechatConfig.AppSecret)
	resp, err := http.Get(URL)
	defer resp.Body.Close() //在回复后必须关闭回复的主体

	body, err := ioutil.ReadAll(resp.Body)
	wx := &Wx{}

	err = json.Unmarshal(body, wx)
	if err != nil {
		return
	}
	WriteToken(wx.AccessToken)
	fmt.Printf(wx.AccessToken)
	*token = wx.AccessToken
	return
}

// 生成一个二维码检验token是否有效 如果无效 => 更新token
func GetAccessToken() (token string) {

	token = ReadToken()
	URL := "https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=" + token
	resp, _ := http.Get(URL)
	defer resp.Body.Close() //在回复后必须关闭回复的主体

	body, _ := ioutil.ReadAll(resp.Body)
	wx := &Wx{}
	_ = json.Unmarshal(body, wx)
	if wx.Errcode > 0 {
		UpdateAccessToken(&token)
		return
	} else {
		return
	}
}

// 从文件读取token
func ReadToken() string {
	fileName := "./wx/AccessToken"
	f, err := ioutil.ReadFile(fileName)
	if err != nil {
		log.Printf("读取文件失败:%#v", err)
		return ""
	}
	return string(f)
}

// 写入token在文件
func WriteToken(token string) {
	fileName := "./wx/AccessToken"
	dstFile, err := os.Create(fileName)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	defer dstFile.Close()
	dstFile.WriteString(token)
}

package controller

import (
	"Fish_Hub/model"
	"Fish_Hub/rsp"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func Authorize() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Request.Header.Get("Authorization")
		if len(token) == 0 {
			c.Abort()
			c.JSON(http.StatusOK, rsp.TokenErr.WithData("token 不能为空"))
			return
		}
		if len(strings.Fields(token)) == 1 {
			c.Abort()
			c.JSON(http.StatusOK, rsp.TokenErr.WithData("token 格式错误"))
			return
		}

		token = strings.Fields(token)[1]
		// 校验token
		result, err := ParseToken(token)
		if err != nil || result == nil {
			c.Abort()
			c.JSON(http.StatusOK, rsp.TokenErr.WithData("token 已失效"))
			return
		}

		c.Set("user_id", result.Id)

		c.Next()
	}
}

func Login(c *gin.Context) {
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

func Regsiter(c *gin.Context) {
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

var jwtSecret = []byte("left793_lc")

func GenerateToken(id int) (string, error) {
	nowTime := time.Now().Unix()
	expireTime := nowTime + 60*60*24*30
	user_id := string(strconv.Itoa(int(id)))
	claims := jwt.StandardClaims{
		Audience:  "lc",              // 受众
		ExpiresAt: expireTime,        // 失效时间
		Id:        user_id,           // 编号
		IssuedAt:  time.Now().Unix(), // 签发时间
		Issuer:    "left793",         // 签发人
		NotBefore: time.Now().Unix(), // 生效时间
		Subject:   "login",           // 主题
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(jwtSecret))
	return "Bearer " + token, err
}

func ParseToken(token string) (*jwt.StandardClaims, error) {
	jwtToken, err := jwt.ParseWithClaims(token, &jwt.StandardClaims{}, func(token *jwt.Token) (i interface{}, e error) {
		return []byte(jwtSecret), nil
	})
	if err == nil && jwtToken != nil {
		if claim, ok := jwtToken.Claims.(*jwt.StandardClaims); ok && jwtToken.Valid {
			if claim.Audience == "lc" && claim.Issuer == "left793" && claim.Subject == "login" {
				return claim, nil
			}
		}
	}
	return nil, err
}

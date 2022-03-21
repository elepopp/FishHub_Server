package rsp

var (
	// OK
	Ok       = response(200, "ok")       // 通用成功
	Err      = response(401, "通用错误")     // 表单错误错误
	ErrParam = response(400, "参数有误")     // 表单错误错误
	TokenErr = response(444, "token 错误") // 表单错误错误
	LoginErr = response(404, "账号和密码不匹配") // 表单错误错误

	UnknownError = response(500, "服务器内部发生错误") // 通用错误
	NotFound     = response(404, "路径未找到")     // 通用错误
	// 服务级错误码
	ErrSignParam = response(10002, "签名参数有误")
	// 模块级错误码 - 用户模块
	ErrUserService = response(20100, "用户服务异常")
	ErrUserPhone   = response(20101, "用户手机号不合法")
	ErrUserCaptcha = response(20102, "用户验证码有误")

	// ......
)

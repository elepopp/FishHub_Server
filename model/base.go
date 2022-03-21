package model

import (
	"database/sql/driver"
	"fmt"
	"time"
)

type BaseModel struct {
	ID        int        `form:"id" json:"id" grom:"primary_key"`
	CreatedAt *LocalTime `json:"created_at" grom:"type:datetime"`
	UpdatedAt *LocalTime `json:"updated_at" grom:"type:datetime"`
	DeletedAt *LocalTime `json:"deleted_at" grom:"type:datetime"`
	OrderNum  float64    `form:"order_num" json:"order_num"`
	Remark    string     `form:"remark" json:"remark" gorm:"size:500"`
}

type LocalTime struct {
	time.Time
}

const TimeFormat = "2006-01-02 15:04:05"

func (t LocalTime) MarshalJSON() ([]byte, error) {
	b := make([]byte, 0, len(TimeFormat)+2)
	b = append(b, '"')
	b = time.Time(t.Time).AppendFormat(b, TimeFormat)
	b = append(b, '"')
	return b, nil
}

func (t *LocalTime) UnmarshalJSON(data []byte) (err error) {
	// 空值不进行解析
	if len(data) == 2 {
		*t = LocalTime{(time.Time{})}
		return
	}

	// 指定解析的格式
	now, err := time.Parse(`"`+TimeFormat+`"`, string(data))
	*t = LocalTime{(now)}
	return
}

func (t LocalTime) Value() (driver.Value, error) {
	var zeroTime time.Time
	if t.Time.UnixNano() == zeroTime.UnixNano() {
		return nil, nil
	}
	return t.Time, nil
}

func (t *LocalTime) Scan(v interface{}) error {
	value, ok := v.(time.Time)
	if ok {
		*t = LocalTime{Time: value}
		return nil
	}
	return fmt.Errorf("can not convert %v to timestamp", v)
}

func (t LocalTime) Check() (error string) {
	fmt.Println(1212)
	return "ada"
}

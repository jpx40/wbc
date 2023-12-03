package util

import "encoding/json"

type Msg_b struct {
	Username string `json:"username"`
	Msg      string `json:"msg"`
	Time     string `json:"time"`
	Date     string `json:"date"`
	UserID   string `json:"user_id"`
	RoomID   string `json:"room_id"`
}

// parse json
func ParseJson(data []byte) (Msg_b, error) {
	var msg Msg_b
	err := json.Unmarshal(data, &msg)
	if err != nil {
		return Msg_b{}, err
	}
	return msg, nil
}

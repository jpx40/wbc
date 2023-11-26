package db

import (
	"database/sql"
	"time"
)

type User struct {
	ID          uint
	Name        string
	Email       *string
	Age         uint8
	ActivatedAt sql.NullTime
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type Message struct {
	ID        uint
	Content   string
	UserID    uint
	RoomID    uint
	CreatedAt time.Time
}

type Room struct {
	ID        uint
	CreatedAt time.Time
	UpdatedAt time.Time
}

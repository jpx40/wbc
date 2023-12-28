package db

import (
	"database/sql"
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID          uint           `gorm:"primarykey; not null" json:"id"`
	Name        string         `json:"name"`
	Email       string         `json:"email"`
	Age         uint8          `json:"age"`
	Password    string         `json:"password"`
	ActivatedAt sql.NullTime   `json:"activated_at"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

type Message struct {
	ID        uint           `gorm:"primarykey; not null" json:"id"`
	Content   string         `json:"content"`
	UserID    uint           `gorm:"not null" json:"user_id"`
	RoomID    uint           `json:"room_id"`
	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

type Room struct {
	ID        uint           `gorm:"primarykey;not null" json:"id"`
	MemberIDs byte           `json:"member_ids"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

type Session struct{}

type Settings struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	Language  string    `json:"language"`
	Theme     string    `json:"theme"`
	Blacklist byte      `json:"blacklist"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Friend struct {
	ID       uint `json:"id"`
	UserID   uint `json:"user_id"`
	UserList byte `json:"user_list"`
}

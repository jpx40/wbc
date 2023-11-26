package db

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type db gorm.DB

func Connect() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	// db.AutoMigrate(&User{}, &Room{}, &Message{})
	return db
}

func (u *User) CreateUser(db *gorm.DB) {
	db.Create(&u)
}

func (r *Room) CreateRoom(db *gorm.DB) {
	db.Create(&r)
}

func (m *Message) CreateMessage(db *gorm.DB) {
	db.Create(&m)
}

func (u *User) GetUser(db *gorm.DB) *gorm.DB {
	return db.Where("id = ?", u.ID).First(&u)
}

func (r *Room) GetRoom(db *gorm.DB) *gorm.DB {
	return db.Where("id = ?", r.ID).First(&r)
}

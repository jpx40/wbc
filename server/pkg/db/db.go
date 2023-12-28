package db

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var Migration bool = false

// type db gorm.DB
func Connect() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("sqlite.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	if Migration {
		error := db.AutoMigrate(&User{}, &Room{}, &Message{}, &Settings{}, &Friend{})
		if error != nil {
			panic(error)
		}
	}
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

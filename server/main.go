package main

import (
	"github.com/jpx40/wdc/pkg/db"
	"github.com/jpx40/wdc/pkg/router"
)

func main() {
	db.Connect()
	router.Router()
}

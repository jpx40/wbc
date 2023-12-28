package main

import (
	_ "github.com/IBM/fp-go/function"
	"github.com/jpx40/wdc/pkg/db"
	"github.com/jpx40/wdc/pkg/router"
	_ "github.com/markbates/goth"
	_ "github.com/phakornkiong/go-pattern-match/pattern"
	_ "github.com/sourcegraph/conc"
)

func main() {
	db.Migration = true

	_ = db.Connect()

	db.Migration = false

	router.Router()
}

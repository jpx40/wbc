package main

import (
	_ "github.com/IBM/fp-go"
	"github.com/jpx40/wdc/pkg/router"
	_ "github.com/markbates/goth"
)

func main() {
	router.Router()
	test("e",
		1)
}

func test(es string, i int) {
}

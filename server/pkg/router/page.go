package router

import (
	"github.com/a-h/templ"
	"github.com/go-chi/chi/v5"
	"github.com/jpx40/wdc/pkg/tmpl"
)

func Page(r chi.Router) {
	r.Get("/counter", templ.Handler(tmpl.Index(tmpl.Counter())).ServeHTTP)
	r.Get("/child", templ.Handler(tmpl.Index(tmpl.Child())).ServeHTTP)
}

package router

import (
	"github.com/a-h/templ"
	"github.com/go-chi/chi/v5"
	"github.com/jpx40/wdc/pkg/tmpl"
)

func Page(r chi.Router) {
	r.Get("/", templ.Handler(tmpl.Index(tmpl.Home())).ServeHTTP)
	r.Get("/chat", templ.Handler(tmpl.Index(tmpl.SimpleChat())).ServeHTTP)

	r.Get("/login", templ.Handler(tmpl.Index(tmpl.Login())).ServeHTTP)
	r.Get("/signup", templ.Handler(tmpl.Index(tmpl.Signup())).ServeHTTP)
	r.Get("/child", templ.Handler(tmpl.Index(tmpl.Child())).ServeHTTP)
}

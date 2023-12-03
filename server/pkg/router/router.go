package router

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/a-h/templ"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jpx40/wdc/pkg/db"
	"github.com/jpx40/wdc/pkg/tmpl"
	"github.com/jpx40/wdc/pkg/util"
	"github.com/olahol/melody"
)

func Router() {
	r := chi.NewRouter()
	m := melody.New()

	defer m.Close()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	// r.Use(cors.Handler(cors.Options{
	// 	// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
	// 	AllowedOrigins: []string{"https://*", "http://*"},
	// 	// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
	// 	AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	// 	AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	// 	ExposedHeaders:   []string{"Link"},
	// 	AllowCredentials: false,
	// 	MaxAge:           300, // Maximum value not ignored by any of major browsers
	// }))

	r.Get("/", templ.Handler(tmpl.Index(tmpl.Home())).ServeHTTP)
	r.Get("/chat", templ.Handler(tmpl.Index(tmpl.SimpleChat())).ServeHTTP)

	r.Get("/login", templ.Handler(tmpl.Index(tmpl.Login())).ServeHTTP)
	r.Get("/signup", templ.Handler(tmpl.Index(tmpl.Signup())).ServeHTTP)

	r.Get("/ws", func(w http.ResponseWriter, r *http.Request) {
		m.HandleRequest(w, r)
	})
	// stactic files
	r.Get("/assets/*", func(w http.ResponseWriter, r *http.Request) {
		http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets/"))).ServeHTTP(w, r)
	})
	Login("/api/login", r)
	Create_User("/signup/create", r)

	workDir, _ := os.Getwd()
	filesDir := http.Dir(filepath.Join(workDir, "assets"))
	FileServer(r, "/files", filesDir)

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		out, err := util.ParseJson(msg)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(string(out.Msg))

		var msgdb db.Message
		msgdb.Content = out.Msg
		//	msgdb.UserID, _ = strconv.Itoa(out.UserID)
		//	msgdb.RoomID, _ = strconv.Atoi(out.RoomID)
		//	msgdb.CreatedAt = out.Time
		msgdb.UserID = uint(rand.Intn(1000))
		msgdb.RoomID = uint(rand.Intn(1000))

		i := &msgdb
		i.CreateMessage(db.Connect())
		m.Broadcast(msg)
	})

	http.ListenAndServe(":3000", r)
}

func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}

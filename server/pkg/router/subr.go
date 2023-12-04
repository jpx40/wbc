package router

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jpx40/wdc/pkg/db"
)

type Test_Data struct {
	Test string `json:"test"`
}

func subrouter(r chi.Router) {
	r.Get("/api/test", func(w http.ResponseWriter, r *http.Request) {
		t := Test_Data{Test: "test"}
		strJ, _ := json.Marshal(&t)
		//		 json.NewEncoder(w).Encode(t)
		w.Header().Set("Content-Type", "application/json")
		// json.NewEncoder(w).Encode(t)
		// w.Write([]byte(string(strJ)))
		w.Write(strJ)
	})
}

func Create_User(url string, r chi.Router) {
	r.Post(url, func(w http.ResponseWriter, r *http.Request) {
		var u User_Data
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)

			return
		}
		fmt.Printf("%+v", u)
		var out db.User
		db_tmp := db.Connect()
		out.Name = u.Name
		out.Email = &u.Email
		out.Password = u.Password
		out.CreateUser(db_tmp)
		w.Header().Set("Content-Type", "application/json")
	})
}

func Login(url string, r chi.Router) {
	var valid bool
	valid = false
	r.Post(url, func(w http.ResponseWriter, r *http.Request) {
		var u User_Login
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}
		out := db.User{}
		s := db.Connect()
		s.Where("name = ?", u.Name).First(&out)
		if out.Password == u.Password {
			valid = true
		} else {
			http.Error(w, "wrong password", http.StatusBadRequest)
			valid = false
		}
	})
	r.Get(url, func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(login_response{Valid: valid})
	})
}

func (u *User_Data) Update(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value("id").(string)
	client := &http.Client{}

	req, err := http.NewRequest("PUT", "https://jsonplaceholder.typicode.com/posts/"+id, r.Body)
	req.Header.Add("Content-Type", "application/json")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer resp.Body.Close()

	w.Header().Set("Content-Type", "application/json")

	if _, err := io.Copy(w, resp.Body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

package router

type User_Data struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
type User_Login struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}
type login_response struct {
	Valid bool `json:"valid"`
}

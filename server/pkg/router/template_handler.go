package router

// import (
// 	"github.com/a-h/templ"
// 	"github.com/jpx40/wdc/pkg/template"
// 	"github.com/labstack/echo/v4"
// )
//
// // indexHandler is the handler for the index route.
//
// func (e *echo.Echo)indexHandler(c echo.Context) error {
// 	cmp := template.Index()
// 	c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextHTML)
// 	return cmp.Render(c.Request().Context(), c.Response().Writer)
// }
//
// func HTML(c echo.Context, cmp templ.Component) error {
// 	c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextHTML)
// 	return cmp.Render(c.Request().Context(), c.Response().Writer)
// }
// func html(cmp templ.Component) error {
// 	c.Response().Header().Set(echo.HeaderContentType, echo.MIMETextHTML)
// 	return cmp.Render(c.Request().Context(), c.Response().Writer)
// }

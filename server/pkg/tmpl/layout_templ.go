// Code generated by templ@v0.2.316 DO NOT EDIT.

package tmpl

//lint:file-ignore SA4006 This context is only used if a nested component is present.

import "github.com/a-h/templ"
import "context"
import "io"
import "bytes"

func Index(comp templ.Component) templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_1 := templ.GetChildren(ctx)
		if var_1 == nil {
			var_1 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<!doctype html><html lang=\"en-US\"><head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width\"><title>")
		if err != nil {
			return err
		}
		var_2 := `Dev`
		_, err = templBuffer.WriteString(var_2)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</title><script src=\"https://cdn.tailwindcss.com\">")
		if err != nil {
			return err
		}
		var_3 := ``
		_, err = templBuffer.WriteString(var_3)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script><script src=\"https://unpkg.com/htmx.org@1.9.9\">")
		if err != nil {
			return err
		}
		var_4 := ``
		_, err = templBuffer.WriteString(var_4)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script><script defer src=\"https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js\">")
		if err != nil {
			return err
		}
		var_5 := ``
		_, err = templBuffer.WriteString(var_5)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script><link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/simplemde/1.11/simplemde.min.css\"><script src=\"https://cdn.jsdelivr.net/simplemde/1.11/simplemde.min.js\">")
		if err != nil {
			return err
		}
		var_6 := ``
		_, err = templBuffer.WriteString(var_6)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script><script src=\"https://cdn.jsdelivr.net/npm/chart.js@3.5.1/dist/chart.min.js\">")
		if err != nil {
			return err
		}
		var_7 := ``
		_, err = templBuffer.WriteString(var_7)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script><script defer src=\"https://unpkg.com/@alpinejs/ui@3.13.3-beta.1/dist/cdn.min.js\">")
		if err != nil {
			return err
		}
		var_8 := ``
		_, err = templBuffer.WriteString(var_8)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script><script defer src=\"https://unpkg.com/@alpinejs/focus@3.13.3/dist/cdn.min.js\">")
		if err != nil {
			return err
		}
		var_9 := ``
		_, err = templBuffer.WriteString(var_9)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script><link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css\"><script src=\"https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js\">")
		if err != nil {
			return err
		}
		var_10 := ``
		_, err = templBuffer.WriteString(var_10)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script><link rel=\"stylesheet\" href=\"/files/style/global.css\"><script type=\"module\" src=\"/files/js/cmp/counter.js\">")
		if err != nil {
			return err
		}
		var_11 := ``
		_, err = templBuffer.WriteString(var_11)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script><script type=\"module\" src=\"/files/js/cmp/child.js\">")
		if err != nil {
			return err
		}
		var_12 := ``
		_, err = templBuffer.WriteString(var_12)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script></head><body id=\"body\">")
		if err != nil {
			return err
		}
		err = comp.Render(ctx, templBuffer)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</body></html>")
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

func Home() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_13 := templ.GetChildren(ctx)
		if var_13 == nil {
			var_13 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<div class=\"flex items-center justify-center h-screen\"></div><script>")
		if err != nil {
			return err
		}
		var_14 := `
  window.onload = () => {
    // window.location = "/login";
  }
`
		_, err = templBuffer.WriteString(var_14)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script>")
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

func SimpleChat() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_15 := templ.GetChildren(ctx)
		if var_15 == nil {
			var_15 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<center><h3 class=\"text-white\">")
		if err != nil {
			return err
		}
		var_16 := `Chat`
		_, err = templBuffer.WriteString(var_16)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</h3><pre id=\"chat\"></pre><input placeholder=\"say something\" id=\"text\" type=\"text\">")
		if err != nil {
			return err
		}
		err = ChatScript().Render(ctx, templBuffer)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</center>")
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

func Login() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_17 := templ.GetChildren(ctx)
		if var_17 == nil {
			var_17 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<link type=\"text/css\" rel=\"stylesheet\" href=\"/assets/style/login.css\"><div id=\"loginbox\" class=\"flex items-center justify-center h-screen\"><div id=\"username\"><h3 class=\"text-white\">")
		if err != nil {
			return err
		}
		var_18 := `Username`
		_, err = templBuffer.WriteString(var_18)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</h3><input id=\"username-field\" placeholder=\"Username\" type=\"text\" class=\"rounded\"></div><div id=\"password\"><h3 class=\"text-white\">")
		if err != nil {
			return err
		}
		var_19 := `Password`
		_, err = templBuffer.WriteString(var_19)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</h3><input id=\"password-field\" placeholder=\"Password\" type=\"password\" class=\"rounded\"></div><div id=\"submit\"><button id=\"login-button\" class=\"rounded text-white bg-blue-500 hover:bg-blue-700 py-2 px-4\" onclick=\"login()\">")
		if err != nil {
			return err
		}
		var_20 := `Login`
		_, err = templBuffer.WriteString(var_20)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</button></div></div>")
		if err != nil {
			return err
		}
		err = LoginScript().Render(ctx, templBuffer)
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

func LoginScript() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_21 := templ.GetChildren(ctx)
		if var_21 == nil {
			var_21 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<script>")
		if err != nil {
			return err
		}
		var_22 := `
  const user = {
    username: "",
    password: "",
  }
  window.onload = () => {
    document.getElementById("loginbox").classList.add("hidden");
  }

  function login() {
    user.username = document.getElementById("username-field").value;
    user.password = document.getElementById("password-field").value;
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    // .then((res) => res.json())
    // .then((data) => {
    //   if (data.status == 200) {
    //     // window.location = "/";
    //     alert("Login successful");
    //   }
    //   else {
    //     alert("Login failed");
    //     console.log(data);
    //   }
    // }
    // )
    // .catch((err) => {
    //   console.log(err);
    // });
    let response = await fetch("/api/login", {
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },

    });


    //decode JSON
    let r = await response.json();
    console.log(r);
    if (r.Valid == true) {
      window.location = "/";

    }





  }

`
		_, err = templBuffer.WriteString(var_22)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script>")
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

func Signup() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_23 := templ.GetChildren(ctx)
		if var_23 == nil {
			var_23 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<link type=\"text/css\" rel=\"stylesheet\" href=\"/assets/style/signup.css\"><div id=\"signupbox\" class=\"flex items-center justify-center h-screen\"><div id=\"username\"><h3 class=\"text-white\">")
		if err != nil {
			return err
		}
		var_24 := `Username`
		_, err = templBuffer.WriteString(var_24)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</h3><input id=\"username-field\" placeholder=\"Username\" type=\"text\" class=\"rounded\"></div><div id=\"password\"><h3 class=\"text-white\">")
		if err != nil {
			return err
		}
		var_25 := `Password`
		_, err = templBuffer.WriteString(var_25)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</h3><input id=\"password-field\" placeholder=\"Password\" type=\"password\" class=\"rounded\"></div><div id=\"email\"><h3 class=\"text-white\">")
		if err != nil {
			return err
		}
		var_26 := `Email`
		_, err = templBuffer.WriteString(var_26)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</h3><input id=\"email-field\" placeholder=\"Email\" type=\"email\" class=\"rounded\"></div><div id=\"submit\"><button id=\"signup-button\" class=\"rounded text-white bg-blue-500 hover:bg-blue-700 py-2 px-4\" onclick=\"signup()\">")
		if err != nil {
			return err
		}
		var_27 := `Signup`
		_, err = templBuffer.WriteString(var_27)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</button></div></div>")
		if err != nil {
			return err
		}
		err = SignupScript().Render(ctx, templBuffer)
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

func SignupScript() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_28 := templ.GetChildren(ctx)
		if var_28 == nil {
			var_28 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<script>")
		if err != nil {
			return err
		}
		var_29 := `
  const user = {
    username: "",
    password: "",
    email: "",
  }

  window.onload = () => {

  }
  let email = document.getElementById("email-field");
  let username = document.getElementById("username-field");
  let password = document.getElementById("password-field");
  function signup() {
    user.username = username.value;
    user.password = password.value;
    user.email = email.value;

    if (user.username === "" || user.password === "" || user.email === "") {
      alert("All fields are required");
    }
    else if (username.value.length < 4) {
      alert("Username must be at least 4 characters long");
    }
    else if (password.value.length < 8) {
      alert("Password must be at least 8 characters long");
    }
    else if (!check_email(email.value)) {
      alert("Invalid email");

    }
    else {
      fetch("/signup/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }).then((res) => {
        if (res.status === 200) {
          //    window.location = "/login";
          alert("Signup successful");
        }
      });

    }

  }
  //email validation
  function check_email(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
`
		_, err = templBuffer.WriteString(var_29)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script>")
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

func ChatScript() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_30 := templ.GetChildren(ctx)
		if var_30 == nil {
			var_30 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<script>")
		if err != nil {
			return err
		}
		var_31 := `
  let user = {
    name: "",
  }

  let messages = [];
  const url = "ws://" + window.location.host + "/ws";
  const ws = new WebSocket(url);
  const name = "Guest" + Math.floor(Math.random() * 1000);
  const fragment = new DocumentFragment();

  let msg = {
    username: "",
    user_id: "",
    room_id: "",
    msg: "",
    time: "",
    date: "",
  }

  ws.addEventListener("open", (event) => {

    // ws.send("Hello Server!");
  });

  ws.addEventListener("message", (event) => {
    data = JSON.parse(event.data);
    console.log("Message from server ", data.msg);
    messageHandler(event);
  });

  ws.addEventListener("close", (event) => {
    ws.close();
  }) let chat = document.getElementById("chat");
  let text = document.getElementById("text");

  text.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && text.value !== "") {
      tmp = msg;
      tmp.username = name;
      tmp.msg = text.value;
      tmp.time = now();
      tmp.date = new Date().toLocaleDateString();
      ws.send(JSON.stringify(tmp));
      text.value = "";
    }

  }) function now() {
    let iso = new Date().toISOString();
    return iso.split("T")[1].split(".")[0];
  }

  function messageHandler(event) {
    msg = JSON.parse(event.data);
    let line = now() + ": " + msg.msg + "\n";
    const span = document.createElement("span");
    span.innerText = line;
    span.setAttribute("class", "text-white font-italic rounded-sm bg-gray-700 px-2 py-1 my-2 block");
    fragment.appendChild(span);

    chat.appendChild(fragment);
  }

`
		_, err = templBuffer.WriteString(var_31)
		if err != nil {
			return err
		}
		_, err = templBuffer.WriteString("</script>")
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

func Counter() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_32 := templ.GetChildren(ctx)
		if var_32 == nil {
			var_32 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<simple-counter count=\"0\"></simple-counter>")
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

func Child() templ.Component {
	return templ.ComponentFunc(func(ctx context.Context, w io.Writer) (err error) {
		templBuffer, templIsBuffer := w.(*bytes.Buffer)
		if !templIsBuffer {
			templBuffer = templ.GetBuffer()
			defer templ.ReleaseBuffer(templBuffer)
		}
		ctx = templ.InitializeContext(ctx)
		var_33 := templ.GetChildren(ctx)
		if var_33 == nil {
			var_33 = templ.NopComponent
		}
		ctx = templ.ClearChildren(ctx)
		_, err = templBuffer.WriteString("<my-parent count=\"2\"><my-element></my-element></my-parent>")
		if err != nil {
			return err
		}
		if !templIsBuffer {
			_, err = io.Copy(w, templBuffer)
		}
		return err
	})
}

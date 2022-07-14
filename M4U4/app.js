var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var session = require("express-session");

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "hulyrtfn",
    resave: false,
    saveUninitialized: true,
  })
);

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get("/", function (req, res) {
  var usuarioAutenticado = Boolean(req.session.usuario);

  res.render("index", {
    title: "Ingrese su usuario y contraseña",
    usuarioAutenticado: usuarioAutenticado,
    usuario: req.session.usuario,
    error: ''
  });
});

app.post("/ingresar", function (req, res) {
  var contraseñaDataBase = "spanish";

  if (req.body.password === contraseñaDataBase) {
    if (req.body.usuario) {
      req.session.usuario = req.body.usuario;
    }
    res.redirect("/");
  } else {
    console.error('Contraseña incorrecta')
  }
});

app.get("/salir", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

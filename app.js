//jshint esversion:6
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose")

var User = require("./models/user")


const app = express();
mongoose.connect("mongodb://localhost:27017/authDB", { useNewUrlParser: true,useUnifiedTopology: true }); //est mongo connection

//use express-session and perform actions
app.use(require("express-session")({
  secret:process.env.SESSION_SECRET, //secret to encode or decode the sessions
  resave:false,
  saveUninitialized:false
}))

app.set('view engine', 'ejs');
//set express to use passport
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

passport.use(new LocalStrategy(User.authenticate()))
//reading the data from the session that is encoded and once done then  encode
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//============================================================================================
//                                                    ROUTES

app.get("/",function(req,res){
  res.render("landing")
})

app.get("/home",isLoggedIn,function(req,res){
  res.render("home")
})

//Auth routes

app.get("/register",function(req,res){
  res.render("register")
})

app.get("/login",function(req,res){
  res.render("login")
})

app.get("/logout",function(req,res){
  req.logout(); //passport logs the user out deletes all the sessions
  res.redirect("/")
})

app.post("/register",function(req,res){
  // var username = req.body.username;
  // var password = req.body.password;

  User.register(new User({username:req.body.username}),req.body.password,function(err,user){
    if(err){
      console.log(err)
      console.log("==========")
      return res.render('register')
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/login")
    })
  })
  //
  // console.log(username)
  // console.log(password)
  // res.redirect("register")
})


//login logic
app.post("/login",passport.authenticate("local",{
  successRedirect:"/home",
  failureRedirect:"/login"
}),function(req,res){


})

//check if user is logged in or nor
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();

  }
  res.redirect("/login");
}


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
//const md5 = require('md5'); 
/* const bcrypt = require("bcrypt");
const saltRounds = 10;  */
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
// dont need to require passport-local; that is a dependency for localmongoose

const app = express();


app.use(express.static("public")); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use( session( {
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false

}));
mongoose.set('useCreateIndex', true);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", 
{ useNewUrlParser: true , useUnifiedTopology: true });

//change schema into a full mongoose schema 
const userSchema = new mongoose.Schema ({
    email: String, 
    password: String
});

userSchema.plugin(passportLocalMongoose);

//this encrypts the password when we do save() and decrypts when we do find()
//we want to store our const secret as an environmental variable in our .env file
// --- const secret = ""; would go here
/* const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password'] }); */
// level 2 done, moving on to level 3 - hashing with md5

const User = new mongoose.model("User", userSchema); 

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", (req, res) => {
    if(req.isAuthenticated()) {
        res.render("secrets");
    } else { 
        res.render("login");
    }
});

app.get("/logout", (req, res) => { 
    //end user session 
    req.logout();
    res.redirect("/");
})

app.post("/register", (req, res) => {
    User.register({username: req.body.username}, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req,res, ()=> {
                res.redirect("secrets")
            })
        }
    })
   
});



app.post('/login', (req,res) => {
    //test@bhash.com 123
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    req.login( user, (err)=> {
        if(err) { 
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, ()=> {
                res.redirect("secrets");

            });
        }
    })
});


app.listen("3000", function() {
    console.log("Server started on port 3000")
});
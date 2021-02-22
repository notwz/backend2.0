//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const md5 = require('md5'); 

const app = express();


app.use(express.static("public")); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", 
{ useNewUrlParser: true , useUnifiedTopology: true });

//change schema into a full mongoose schema 
const userSchema = new mongoose.Schema ({
    email: String, 
    password: String
});

//this encrypts the password when we do save() and decrypts when we do find()
//we want to store our const secret as an environmental variable in our .env file
// --- const secret = ""; would go here
/* const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password'] }); */
// level 2 done, moving on to level 3 - hashing with md5

const User = new mongoose.model("User", userSchema); 



app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", (req, res) => {

    const newUser = new User( {
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save( (err) => {
        console.log(err || res.render("secrets"));
    });
});


app.post('/login', (req,res) => {
    const username = req.body.username;
    //turn the password they typed and hash it; use the hashed version of the password to compare with the hashed value in our Database
    const password = md5(req.body.password);

    User.findOne({ email: username}, (err, foundUser) =>{
        if(err) {
            console.log(err);
        } else {
            if( foundUser){
                if(foundUser.password === password) {
                    res.render('secrets');
                }
            }
        }
    })
}
);


app.listen("3000", function() {
    console.log("Server started on port 3000")
});
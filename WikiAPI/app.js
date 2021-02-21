//starting server code 

// requiring our node packages 
const express = require("express"); 
const bodyParser = require("body-parser");
const ejs = require("ejs"); 
const mongoose = require("mongoose"); 

const app = express(); 


//setting our viewing engine as ejs (views) (template) 
app.set('view engine', 'ejs'); 

//setting up body parser node package that allows us to parse our requests 
app.use(bodyParser.urlencoded( {
    extended: true
}));

//setting app to use express node package; use the public directory to store our static files like images and css code 
app.use(express.static("public"));

// ---- end of requiring and settings ---- 

mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);
    

//want to save data that is sent over into a document 
//chainable refactored code!

app.route("/articles")

    .get(function (req, res) { 
        Article.find(function(err, foundArticles) {
            if(!err) {
                console.log(foundArticles);
                res.send(foundArticles);
            }else {
                res.send(err);
            }
            
        });
    })

    .post(function (req, res) {

        const article= new Article ({
            title: req.body.title,
            content: req.body.content
        });
        article.save(function(err) {
            if(!err) { 
                res.send("sucessfully added a new article");
            } else {
                res.send(err);
            }
        });

        console.log(req.body.title);
        console.log(req.body.content);
    })

    .delete(function(req, rest) {
        Article.deleteMany(function(err) {
            res.send(err || "Sucessfully deleted");
        });
    });


// ---- targeting specific routes ----
app.route("/articles/:articleTitle")

    .get(function (req, res) {
        Article.findOne( {title: req.params.articleTitle}, 
            function(err, foundArticle) {
                if(foundArticle) { 
                    res.send(foundArticle)
                } else {
                    //res.send("No articles matching that title was found");
                    res.send(err);
                }
            });
    });

//our app is listening on set port 
app.listen(3000, function() { 
    console.log("Server starting up on port 3000"); 
});
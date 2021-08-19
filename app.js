const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema=mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article',articleSchema);

app.get("/",function(req,res){
    res.send("<h1> Hello! </h1>");
});

app.route("/articles")
.get(function(req,res){
    Article.find({},function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }else{
            console.log(err);
        }
    });
})
.post(function(req,res){
    const articleTitle=req.body.title;
    const articleBody=req.body.content;

    const newArticle = new Article({
        title: articleTitle,
        content: articleBody
    });

    newArticle.save();
    res.send("Article added.");
})
.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(!err){
            res.send("All articles deleted.");
        }
    });
});

app.route("/articles/:articleName")
.get(function(req,res){
    Article.findOne({title: req.params.articleName},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            console.log(err);
        }
    });
})
.put(function(req,res){
    Article.updateOne(
        {title: req.params.articleName},
        {title: req.body.title, content:req.body.content},
        function(err){
            if(!err){
                res.send("Successfully updated article.");
            }else{
                res.send(err);
            }
        }
    );
})
.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleName},
        {$set : req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article.");
            }else{
                res.send(err);
            }
        }
    );
})
.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleName},
        function(err){
            if(!err){
                res.send("Successfully deleted article.");
            }else{
                res.send(err);
            }
        }
    );
});

app.listen(3000,function(){
    console.log("Server running on port 3000");
});
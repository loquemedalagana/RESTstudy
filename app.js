const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",  { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

//req targetting all articles

app.route("/articles") //for a single route

.get((req, res) => {
    Article.find((err, foundArticles) => {
        if(err){
            res.send(err);
        }
        else{
            res.send(foundArticles);
        }
    });
})

.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) => {
        if(err){
            res.send("Successfully added!")
        }
        else{
            res.send(err);
        }
    });    
})

.delete((req, res) => {
    Article.deleteMany((err) => {
        if(err){
            res.send(err);
        }
        else{
            res.send("All articles have been deleted")
        }
    });
}); //chained method

//req for a specific route

app.route("/articles/:articleTitle") //routing parameter

.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
        if(err){
            res.send(err);
        }
        else{
            if(foundArticle){
                res.send(foundArticle);
            }
            else{
                res.send("No articles matching that title was found");
            }
        }
    });        
})

.put((req, res) => {
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite : true},
        (err) =>{
            if(err){
                res.send(err);
            }
            else{
                res.send("changed!");
            }
    });
})

.patch((req, res) => {
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body}, //클라가 어느 부분을 업데이트할건지 선택? (다른거만 업데이트)
        (err) => {
            if(err){
                res.send(err);
            }
            else{
                res.send("changed!");
            }
        }
    );
})

.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, err => {
        if(err){
            res.send(err);
        }
        else{
            res.send("sucessfully deleted!");
        }
    })
});


app.listen(3000, () => console.log("Server started on port 3000"));
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

app.route("/articles").get().post().delete(); //chained method

app.get("/articles", (req, res) => {
    Article.find((err, foundArticles) => {
        if(err){
            res.send(err);
        }
        else{
            res.send(foundArticles);
        }
    });
});

app.post("/articles", (req, res) => {
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
});

app.delete("/articles", (req, res) => {
    Article.deleteMany((err) => {
        if(err){
            res.send(err);
        }
        else{
            res.send("All articles have been deleted")
        }
    });
})

app.listen(3000, () => console.log("Server started on port 3000"));
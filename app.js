const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//Targetting all articles
app.route("/articles").get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        }
        else{
            console.log(err);
        }
        
    })
})
.post(function(req, res){
    console.log();
    console.log();

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(err){
            res.send(err);
        } else{
            res.send("Successfully loaded the document");
        }
    })
})
.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all articles!");
        } else{
            res.send(err);
        }
    })
});


//Targetting a specific article
app.route("/articles/:articleTitle")
.get(function(req, res){
    
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No articles found that match")
        }
    })
})
.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        
        function(err){
            if(err){
                res.send("An error occured!")
            } else{
                res.send("Updated successfully!")
            }
        }
    );
})
.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}, 
        function(err){
            if(!err){
                res.send("Patched successfully!")
            } else{
                res.send("An error occured")
            }
        });
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted");
            } else{
                res.send("An errpr occured");
            }
        }
    )

});


app.listen(3000, function(){
    console.log("Server is running on port 3000")
})
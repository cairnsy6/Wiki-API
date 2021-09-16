const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema)

/////////////////////Requests for Articles//////////////////////////////////////

app.route('/articles')
    
    .get((req, res)=> {

    Article.find({}, function (err, articles) {
    if (err) {
        res.send(err);
    }
    else{
    console.log(articles);
    res.send({artciles:articles});
    }
})
})


    .post((req, res) => {

    const newArticle = new Article({
        title: req.body.title,
         content: req.body.content
        });
    
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added new article")
        }
        else{
            res.send(err)
        }
    });
    
})

    .delete((req, res)=>{
    Article.deleteMany(function (err){
        if (err){
            res.send(err)
        }
        else{
            res.send("Successfully deleted")
        }
    })
    
});

/////////////////////Requests for Specific Articles//////////////////////////////////////

app.route('/articles/:articleTitle')

.get((req, res)=>{

    const articleTitle = req.params.articleTitle

    Article.find({title: articleTitle}, function (err, article) {
        if (err) {
            res.send(err);
        }
        else{
        console.log(article);
        res.send({article});
        }
})
})

.put((req, res)=>{

    const articleTitle = req.params.articleTitle

    Article.updateOne({title: articleTitle},
        {$set: req.body},
        function (err){
            if(err){
                res.send(err)
            }
            else{
                res.send("Updated Successfully")
            }
        })
})

.patch((req, res)=>{

    const articleTitle = req.params.articleTitle

    Article.updateOne({title: articleTitle},
        {title: req.body.title, content: req.body.content},
        function (err){
            if(err){
                res.send(err)
            }
            else{
                res.send("Updated Successfully")
            }
        })
})

.delete((req, res)=>{

    const articleTitle = req.params.articleTitle

    Article.deleteOne({title: articleTitle},
        function (err){
            if(err){
                res.send(err)
            }
            else{
                res.send("Updated Successfully")
            }
        })
})


app.listen(3000, (req,res)=>{
    console.log("Server is running on port 3000")
})
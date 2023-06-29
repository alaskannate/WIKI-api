//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//CONNECT TO MongoDB 
const uri = "mongodb+srv://nateewing93:Travelin.20@cluster0.cxhnnxh.mongodb.net/wikiDB?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
connect();


//Defining schema for the datebase collection "posts"...
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Article = mongoose.model('Article', articleSchema, )



app.route('/articles')

  .get((req, res) => {
    Article.find({})
      .then((foundArticles) => {
        if (foundArticles.length === 0) {
          return res.send("No articles found.");
        } else {
          console.log(foundArticles);
          res.send(foundArticles);
        }

      })
      .catch((error) => {
        console.error('Error finding articles:', error);
        res.status(500).send(error);
      });
  })

  .post((req, res) => {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save()
      .then(() => {
        console.log(req.body.title + " saved to database.");
        res.send('New article saved.')
      })
      .catch((error) => {
        console.error('Error Posting items:', error);
        res.status(500).send(error);
      });
  })

  .delete((req, res) => {

    Article.deleteMany({})
      .then(() => {
        res.send("All articles deleted.")
      })
      .catch((error) => {
        console.error('Error Deleting items:', error);
        res.status(500).send(error);
      });
  });

app.route('/articles/:articleTitle')

  .get((req, res) => {
    Article.findOne({
        title: req.params.articleTitle
      })
      .then((foundArticle) => {
        console.log(foundArticle);
        res.send(foundArticle);
      })
      .catch(err => {
        console.log(err);
      });

  })

  .put((req, res) => {

    const searchedTitle = req.params.articleTitle;

    Article.replaceOne({

      title: searchedTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }).then(updatedArticle => {
      res.send(updatedArticle);
      console.log(searchedTitle + " has changed to " + req.body.title)
    }).catch(err => {
      console.log(err);
    })

  })

  .patch((req, res) => {

    const searchedTitle = req.params.articleTitle;

    Article.replaceOne({
        title: searchedTitle
      }, {
        $set: req.body
      })
      .then(updatedArticle => {
        res.send(updatedArticle);
        console.log(searchedTitle + " has changed to " + req.body.title)
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: 'An error occurred'

        });
      });
  })

.delete((req, res) => {
  Article.deleteOne({})
  .then(() => {
    res.send("One article deleted.")
  })
  .catch((error) => {
    console.error('Error Deleting items:', error);
    res.status(500).send(error);
  });
});




app.listen(3000, function () {
  console.log("Server started on port 3000");
});
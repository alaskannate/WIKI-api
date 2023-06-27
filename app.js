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
const articleSchema = new mongoose.Schema ({
  title: String,
  content: String
})

const Article = mongoose.model('Article', articleSchema,)



//GET MANAGMENT

app.get('/articles', (req, res) => {

  Article.find({})
  .then ((foundArticles) =>{
   console.log(foundArticles);
   res.send(foundArticles)
  })

  .catch((error) => {
    console.error('Error Finding items:', error);
    res.status(500).send(error);
  });
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
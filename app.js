const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// APP CONFIG
mongoose
    .connect("mongodb://localhost:27017/restfull_blog_app", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected to DB!");
    })
    .catch((error) => {
        console.log(error.message);
    });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now },
});

var Blog = mongoose.model("Blog", blogSchema);

// ALL RESTFUL ROUTES

app.get("/", (req, res) => {
    res.redirect("blogs");
});

//1-INDEX => '/dogs' => GET for listing all dogs
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("ERROR!!");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

//2- NEW => '/dogs/new' => GET for showing new dog form
app.get("/blogs/new", (req, res) => {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("new", { blogs: blogs });
        }
    });
});

//3- CREATE => '/dogs' => POST for creating new dog then redirect somewhere

app.post("/blogs", (req, res) => {
    //create blog
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new");
        } else {
            //then redirect
            res.redirect("/blogs");
        }
    });
});

//4- SHOW => '/dogs/:id' => GET for showing info about one spesific dog

app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

//5- EDIT => '/dogs/:id/edit
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

app.listen(3000, () => {
    console.log("Server is listening!!");
});

//Manually creating a post
// Blog.create({
//     title: "TEST BLOG",
//     image:
//         "https://images.pexels.com/photos/69776/tulips-bed-colorful-color-69776.jpeg?auto=compress&cs=tinysrgb&h=350",
//     body: "This is BLOG POST",
// });

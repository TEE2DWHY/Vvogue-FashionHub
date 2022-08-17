const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const session = require("express-session");
const passport = require("passport");
const paspportLocalMongoose = require("passport-local-mongoose");
const dotenv = require('dotenv').config()
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())

mongoose.connect("mongodb+srv://admin-tayo:highzick@cluster0.hsis8td.mongodb.net/?retryWrites=true&w=majority/fashionDB")

const orderSchema = new mongoose.Schema({

    amount: String,
    size: String,
    order_id: String,
    productname: String,
})

orderSchema.plugin(paspportLocalMongoose)

const Order = mongoose.model("Order", orderSchema)

passport.use(Order.createStrategy());
passport.serializeUser(function (user, done) {
    done(null, user.id);
    // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    phonenumber: String,
    password: String,

});
userSchema.plugin(paspportLocalMongoose)

const User = mongoose.model("User", userSchema)
passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
    done(null, user.id);
    // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


app.get("/", function (req, res) {
    res.render("index")
})

app.get("/user-signin", function (req, res) {
    res.render("user-signin")
})

app.get("/shop-grid-ft", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("shop-grid-ft");
    }
    else {
        res.redirect("/user-signin")
    }
})

app.get("/user-signup", function (req, res) {
    res.render("user-signup");
})

app.get("/error", function (req, res) {
    res.render("error")
})

app.get("/purchase1", function (req, res) {
    res.render("purchase1")
})

app.post("/user-signup", function (req, res) {
    User.register({ firstname: req.body.firstName, lastname: req.body.lastName, username: req.body.username, phonenumber: req.body.telephone }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("Error: email already exits, try another");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/shop-grid-ft")
            })
        }
    })
})

app.post("/user-signin", function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    req.login(user, function (err) {
        if (err) {
            res.redirect(err)
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/shop-grid-ft");
            })
        }
    })
})

app.post("/shop-grid-ft", function (req, res) {
    const order = new Order({
        amount: req.body.amount,
        size: req.body.size,
        order_id: req.body.item,
        productname: req.body.productname,

    })
    order.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/purchase1")
        }
    })
})


app.listen("3000", function () {
    console.log("server is running on port 3000")
})
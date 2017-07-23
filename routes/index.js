var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function (req,res){
   res.render("landing");
});

// ======================
// AUTH ROUTES
// ======================

// show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){ //err coming from passport
        if(err){
             return res.render("register", {"error": err.message});
        /*   req.flash("error", err.message);
            return res.redirect("/register");*/
        }
        passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to Jom Hiking " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login"); //, {message: req.flash("error")} instead of passing individually can also declare them in app.js like how we do for currentuser
});


router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        successFlash: "You have successfully logged in.",
        failureFlash: "Login failed, you have entered incorrect credentials."
    }));

// logout route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Successfully Logged Out!");
    res.redirect("/campgrounds");
});

module.exports = router;

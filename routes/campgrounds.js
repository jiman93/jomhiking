var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


// ===============================
// CAMPGROUND ROUTES
// ====================================

//INDEX - show all campgrounds
router.get("/", function (req,res){
    //Get all campgrounds from DB
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
      
});

//CREATE - add new campgorund into DB
router.post("/", middleware.isLoggedIn, function(req,res){
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username:req.user.username
   }
   var newCampground = {name:name, price:price, image:image, description:desc, author:author}
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
          //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    
   
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
   res.render("campgrounds/new") ;
});


//SHOW - shows more info about one campground
router.get("/:id", function(req,res){
    //find the campground with provided ID
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
       }
   });
   
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    // is user logged in?
        //if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){

               /*if(err){
                   res.redirect("/campgrounds");
               } else {
                    // does user own the campground
                    if(foundCampground.author.id.equals(req.user._id)){
                        // if(foundCampground.author.id === req.user._id) wont work because .foundCampground.author.id is an object while req.user._id is a string */
                        
                       res.render("campgrounds/edit", {campground: foundCampground});
                    /*} else {
                        res.send("you do not have permission to do that") ;
                    }
               }
            });
        } else {
            console.log("you need to be logged in to do that!");
            res.send("you need to be logged in to do that");
        } */
       
        // otherwise, redirect
    //if not redirect
});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
             //redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
});



//middleware
/*function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}*/

/*function checkCampgroundOwnership(req, res, next) {
           if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
               if(err){
                   res.redirect("back");
               } else {
                    // does user own the campground
                    if(foundCampground.author.id.equals(req.user._id)){
                        // if(foundCampground.author.id === req.user._id) wont work because .foundCampground.author.id is an object while req.user._id is a string
                       next();
                    } else {
                        res.redirect("back");
                    }
               }
            });
        } else {
            res.redirect("back");
        }
}*/


module.exports = router;
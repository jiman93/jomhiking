var express = require("express");
var router = express.Router({mergeParams: true}); //fix id issue with the object
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// =====================================
// COMMENTS ROUTES
// ======================================

// COMMENTS NEW
router.get("/new", middleware.isLoggedIn,  function (req,res){
    //find campground by Id
    Campground.findById(req.params.id, function(err,campground){
       if (err){
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground}); //logic behind comments/new
       }
    });
});


// COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Succesfully created comment");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
            res.redirect("back");
        } else
         res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//  COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
            req.flash("success", "Comment successfully deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

module.exports = router;
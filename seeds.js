var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment")

var data =[
    {
        name: "Gunung Kinabalu", 
        image :"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
        description: "blah blah blah blah blah"
    },
    {
        name: "Tanjung Rambutan", 
        image :"https://farm9.staticflickr.com/8225/8524305204_43934a319d.jpg",
        description: "blah blah blah blah blah"
    },
    {
        name: "Bukit Broga", 
        image :"https://farm3.staticflickr.com/2353/2069978635_2eb8b33cd4.jpg",
        description: "blah blah blah blah blah"
    }
    ]

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function (err){
        if(err){
            console.log(err);
        } 
        console.log("removed campgrounds!");
         //add a few campgrounds
            data.forEach(function(seed){
                  Campground.create(seed, function(err, campground){
                      if(err){
                          console.log(err);
                      } else {
                          console.log("added a campground!");
                          //create a comment
                         Comment.create(
                             {
                                 text: "This place is great!",
                                 author: "Homer"
                             }, function(err, comment){
                                 if (err){
                                     console.log(err)
                                 } else{
                                     campground.comments.push(comment);
                                     campground.save();
                                     console.log("Created a new comment!");
                                 }
                             });
                      }
                  });
        });
        });
       
      
   
    
}

module.exports = seedDB;
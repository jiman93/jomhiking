var express = require("express");
var router = express.Router();


//INDEX - show all campgrounds
router.get("/dev", function (req,res){
            res.render("dev");  //how res.render know dev.ejs located inside view directory?
    });
    
    
module.exports = router;

      


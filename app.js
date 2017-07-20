var express    = require("express"),
    app        = express (), 
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    Campground = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
// Requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index"),
    devRoutes        = require("./routes/dev")

mongoose.Promise = global.Promise;    
mongoose.connect("mongodb://localhost/hiking_trail", { useMongoClient: true });
app.use(bodyParser.urlencoded({extended: true})); // telling express 
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();   // seed the database

//PASSPORT CONFIGURATION also for flash
app.use(require("express-session")({
    secret: "You can actually put anything here, said by Colt Steele",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //comes from passport local mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){   //middleware, using this function on every single routes to avoid DRY
    res.locals.currentUser = req.user; //without this app.use, need to do as line 47 on every routes
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next ();
});

app.use(indexRoutes);
app.use(devRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
});
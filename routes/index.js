var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post")
const passport = require("passport");
const upload = require("./multer");

// user login
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */

//making routes
router.get('/', function(req, res, next) {
  // console.log(req.flash("error"));
  res.render('index',{error:req.flash("error"),nav: false});
});

router.get('/register', function(req, res, next) {
console.log(req.flash("error"));//this is printed only when there's an error -'Password or username is incorrect'
  res.render('register', {error:req.flash("error"), nav: false}); 
});


//uploading profile picture
router.post("/fileupload", isLoggedIn, upload.single("image"), async function(req, res, next){
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile")
})


//multer
router.post('/upload', isLoggedIn, upload.single("file"), async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("no files were given");
  }
  // res.send("file uploaded successfully");
  const user = await userModel.findOne({username: req.session.passport.user});

  //creating post
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });

  //giving id of post to user
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});
// jo file upload hui h use save karo as a post and uska postid user ko do aur post ko userid do

router.get("/profile", isLoggedIn, async function(req, res, next){
  const user = await userModel
  .findOne({username: req.session.passport.user})
  .populate("posts")
  res.render("profile", {user,  nav:true})
});


router.get("/feed", isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({username: req.session.passport.user})

  const posts = await postModel.find();

  res.render("feed", {user, posts, nav: true})

});


router.get("/show", isLoggedIn, async function(req, res, next){
  const user = await userModel
  .findOne({username: req.session.passport.user})
  .populate("posts")
  res.render("show", {user,  nav:true})
});

router.get("/add", isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({
    username: req.session.passport.user
  })

  res.render("add", {user,  nav:true})
});

router.post("/createpost", isLoggedIn, upload.single("postimage"), async function(req, res, next){

  const user = await userModel.findOne({username: req.session.passport.user})

  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  });

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});


//making functions
router.post("/register", function(req, res){
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    name: req.body.fullname
  })

  userModel.register(userData, req.body.password)
  .then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    })
  })

})


router.post("/login",passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/",
  failureFlash: true 
}) ,function(req, res){
})

router.get("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}
module.exports = router;

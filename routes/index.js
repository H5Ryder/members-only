const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const genHash = require("../lib/passwordUtils").genHash;
const connection = require("../config/database");
const User = require("../models/user");
const Post = require("../models/post");
const isAuth = require("../config/authMiddleware").isAuth;
const isAdmin = require("../config/authMiddleware").isAdmin;


/* GET home page. */
router.get("/test", function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render("index", { user: req.user });
  } else {
    res.render("index", { user: req.user });
  }
});

/* NEW HOMEPAGE */
router.get("/", async function (req, res, next) {

  const posts = await Post.find().sort({date: 1}).populate("user").exec();

  if (req.isAuthenticated()) {
  res.render("index", { user: req.user, posts: posts });
  } else {
    res.render("index", { user: null, posts: posts });

  }
});

//FAILED LOGIN
router.get("/login-failure", function (req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send(`<h1>Login Failure</h1>`);
});

// Login------------
// GET--------------
router.get("/login", (req, res, next) => {
  res.render("log-in-form");
});
// POST-------------
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-failure",
  })
);

// Sign Up----------
//GET---------------
router.get("/sign-up", (req, res) => res.render("sign-up-form"));
//POST--------------
router.post("/sign-up", async (req, res, next) => {
  const hash = await genHash(req.body.password);

  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      hash: hash,
    });

    const result = await user.save();

    req.login(user, function (err) {
      if ( ! err ){
          res.redirect('/');
      } else {
          //handle error
          return next(err);

      }
    });

    
    
  } catch (err) {
    return next(err);
  }
});

//LOGOUT
// GET
router.get("/logout", isAuth, (req, res, next) => {
  req.logout(() => {
    res.redirect("/");
  });
});

//BECOME ADMIN
//GET
router.get("/become-admin", isAuth, (req, res, next) => {
  res.render("admin-form", { user: req.user });
});
//POST
router.post("/become-admin", isAuth, async (req, res, next) => {
  if ((req.body.password = "letmein")) {
    const updatedUser = new User({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      hash: req.user.hash,
      isMember: req.user.isMember,
      isAdmin: true,
      _id: req.user.id,
    });

    const update = await User.findByIdAndUpdate(req.user.id, updatedUser, {});
    res.redirect("/");
  } else {
    res.redirect("/become-admin");
  }
});

//BECOME MEMBER
//GET
router.get("/become-member", isAuth, (req, res, next) => {
  res.render("member-form", { user: req.user });
});
//POST
router.post("/become-member", isAuth, async (req, res, next) => {
  if ((req.body.password = "letmein")) {
    const updatedUser = new User({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      hash: req.user.hash,
      posts: req.user.posts,
      isMember: true,
      isAdmin: req.user.isAdmin,
      _id: req.user.id,
    });

    const update = await User.findByIdAndUpdate(req.user.id, updatedUser, {});
    res.redirect("/");
  } else {
    res.redirect("/become-member");
  }
});

//SEND MESSAGE
router.post("/new-post", isAuth, async (req, res, next) => {
  try {
    console.log("we got herre");
    const message = new Post({
      title: req.body.title,
      text: req.body.text,
      date: new Date(),
      user: req.user.id,
    });

    const result = await message.save();
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});


//DELETE POST
router.get('/delete-post', isAdmin, async (req, res) => {

  const postId = req.query.id; // Accessing the data-id sent from the client-side

  try {
    const postToDelete = await Post.findById(req.query.id).exec();

    if (postToDelete === null) {
      res.redirect("/");
    } else {
      await Post.findByIdAndDelete(req.query.id);
      res.redirect("/");
    }
    
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
  // Use the postId for further processing
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


// signup get route
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// signup post route
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

// login get route
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// login post route
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    res.redirect("/listings");
});

module.exports = router;
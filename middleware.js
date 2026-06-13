module.exports.isLoggedIn = (req, res, next) => {
    console.log("isAuthenticated:", req.isAuthenticated()); // add this
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};
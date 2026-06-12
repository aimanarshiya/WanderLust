const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const session = require("express-session");
const flash = require("connect-flash");


main()
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}
// expresss sessions
const sessionOptions = {
  secret :"mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=> {
  res.locals.success = req.flash("success");
  next();
})

app.get("/", (req, res) => {
  res.send("Hi, I am root Working here");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(9090, () => {
  console.log("server is working under port 9090");
});
// Date : 17 may 2026
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { STATUS_CODES } = require("http");
const { listingSchema, reviewSchemaJoi } = require("./schema.js");



app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
  .then((res) => { 
    console.log("Connected  to Database"); 
  })
  .catch((err) => { 
    console.log(err); 
  });

  async function main(){
    await mongoose.connect(MONGO_URL);
  }

app.get("/",(req,res)=>{
    res.send("Hi, Iam root Working here");
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));




const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(".");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// for index route
app.get("/listings",wrapAsync(async (req,res) =>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
}));

// fr new route
app.get("/listings/new",(req,res)=>{
  res.render("listings/new.ejs");
});

// for edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);

  res.render("listings/edit.ejs", { listing });
}));

// update route

app.put("/listings/:id",validateListing,wrapAsync( async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  res.redirect(`/listings/${id}`);
}));

// for create route
app.post("/listings",validateListing,wrapAsync(async(req,res) =>{

  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));


// for show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
}));

// for delete listing route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));


// validate review middleware
const validateReview = (req, res, next) => {
    let { error } = reviewSchemaJoi.validate(req.body);
    if (error) {
        let message = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, message);
    } else {
        next();
    }
};

// post review route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${req.params.id}`);
}));

// delete reviews
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
}));
// ------used ti initialise db with datas--------
// app.get("/testListing", async(req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});

app.listen(9090,()=>{
    console.log("server is working under port 9090")
});


const express = require("express");
const Listing = require("./Model/Listing");
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExError = require("./Errorhandling/errorclass");
const { listingSchema } = require("./listingSchema.js");
const Reviews = require('./Model/review');
const { reviewSchema } = require('./ReviewSchema.js');
const listingsRouter = require('./Routers/listing');
const reviewsRouter = require('./Routers/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy = require("passport-local").Strategy;
const passport = require('passport');
const User = require('./Model/User');
const UserRouter = require('./Routers/User');
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const isLogIn = require("./midleware/isLogIn");

const app = express();

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs', engine);

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

// Database connection
const URL = 'mongodb://127.0.0.1:27017/TSMajorPro';
const main = async () => {
    await mongoose.connect(URL);
};
main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log("Error in connection with DB", err);
});

// Session configuration
app.use(session({
    secret: 'your-secret-key', // Change this to a secure random key
    resave: false,
    saveUninitialized: false,

    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    }
}));

// Initialize flash
app.use(flash());

// Passport.js middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; // Making user available to all templates
    next();
});

// Routes
app.get("/", (req, res) => {
    res.render("Home.ejs");
});

app.use('/listings', listingsRouter);
app.use('/user', UserRouter);

// Validation middleware for reviews
const validateReviewSchema = (req, res, next) => {
    let joiResult = reviewSchema.validate(req.body);
    // if (joiResult.error) {
    //     throw new ExError("408", "Error in review schema when inserting the data:");
    // } else {
    //     next();
    // }
    next();
};

// Review routes
app.post("/listings/:id/reviews",isLogIn, validateReviewSchema, async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        const r1 = new Reviews(req.body);
        r1.author = req.user;
        listing.reviews.push(r1);
        await r1.save();
        await listing.save();

        console.log(listing,r1);
        req.flash('success', 'Review added successfully!');
        res.redirect(`/listings/${req.params.id}`);
    } catch (err) {
        req.flash('error', 'Failed to add review.');
        return next(err);
    }
});
//Deleting Review ...
app.get("/listings/:listId/reviews/:revid",isLogIn ,async (req, res) => {
   
    const { listId, revid } = req.params;
    let list = await Reviews.findById(revid);
    if(!list.author._id.equals(req.user.id))
    {
        return res.send("Not are not allowed to delete this Review,becuase you are not author of this review");
    }
    await Reviews.findByIdAndDelete(revid);
    await Listing.findByIdAndUpdate(listId, { $pull: { reviews: revid } });
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${listId}`);
});

const port = 8081;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

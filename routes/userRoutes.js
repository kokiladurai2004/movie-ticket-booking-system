// // routes/userRoutes.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // Route for user registration
// router.post('/register', async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.redirect('/login');
//   } catch (error) {
//     res.status(400).send('Error registering user');
//   }
// });

// module.exports = router;


// routes/userRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Movie = require("../models/Movie");
const router = express.Router();


router.get("/alogin", (req, res) => {
    const errorMessage = req.session.errorMessage || ""; // Default to an empty string if undefined
    delete req.session.errorMessage;
    res.render("alogin", { errorMessage });
});

router.post("/alogin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            res.redirect("/admin-home");
        } else {
            req.session.errorMessage = "Enter valid credentials.";
            res.redirect("/alogin");
        }
    } catch (error) {
        console.error(error);
        req.session.errorMessage = "An error occurred. Please try again.";
        res.redirect("/alogin");
    }
});


// Route to delete a movie by title
router.post("/delete-movies/:title", async (req, res) => {
    try {
        const movieTitle = req.params.title;
        await Movie.findOneAndDelete({ title: movieTitle });
        res.redirect("/admin-home"); // Redirect back to admin home after deletion
    } catch (error) {
        console.error(error);
        res.send("An error occurred while trying to delete the movie.");
    }
});



router.get("/admin-home", (req, res) => {
    res.render("admin-home");
});
router.post("/admin-home", async (req, res) => {
    const selectedAction = req.body.action;

    if (selectedAction === "view") {
        try {
            const movies = await Movie.find({});
            res.render("view-movies", { movies });
        } catch (error) {
            console.error(error);
            res.send("An error occurred while fetching movie details.");
        }
    } else if (selectedAction === "add") {
        // Pass the selectedAction to the view
        res.render("admin-home", { action: "add" });
    } else if (selectedAction === "delete") {
        const movies = await Movie.find({});
        res.render("delete-movies", { movies });
    } else {
        res.send("Invalid selection");
    }
});


// Route to handle adding a new movie
router.post("/add-movie", async (req, res) => {
    try {
        const {
            title,
            language,
            genre,
            location,
            releaseDate,
            posterUrl,
            theatreId,
            theatreName,
            theatreLocation,
            availableSeats,
            showtime,
        } = req.body;

        // Create a new movie document
        const newMovie = new Movie({
            title,
            language,
            genre,
            location,
            releaseDate,
            posterUrl,
            theatres: [
                {
                    id: theatreId,
                    name: theatreName,
                    location: theatreLocation,
                    availableSeats,
                    showtimes: [
                        {
                            time: showtime,
                            bookedSeats: [], // Initialize booked seats as empty
                        },
                    ],
                },
            ],
        });

        await newMovie.save(); // Save the new movie to the database
        res.redirect("/admin-home"); // Redirect to admin home after adding the movie
    } catch (error) {
        console.error(error);
        res.send("An error occurred while trying to add the movie.");
    }
});



// Route to display registration form
router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/index", (req, res) => {
    res.render("index");
});

// Route to handle registration form submission
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.redirect("/register");
    }
});

// Route to display login form


router.get("/login", (req, res) => {
    const errorMessage = req.session.errorMessage || ""; // Default to an empty string if undefined
    delete req.session.errorMessage;
    res.render("login", { errorMessage });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            res.redirect("/home");
        } else {
            req.session.errorMessage = "Enter valid credentials.";
            res.redirect("/login");
        }
    } catch (error) {
        console.error(error);
        req.session.errorMessage = "An error occurred. Please try again.";
        res.redirect("/login");
    }
});



module.exports = router;


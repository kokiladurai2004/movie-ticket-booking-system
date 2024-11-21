

const express = require("express");
const router = express.Router();
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
// const Booking = require('../models/Booking');
const app = express();
const mongoose = require('mongoose');

// router.get('/book/:movietitle', async (req, res) => {
//     try {
//         // Log the movieId to ensure it's being received correctly
//         console.log("Movie ID:", req.params.movietitle);
        

//         const movieId1 =req.params.movietitle;
//         const movie = await Movie.findOne({ title: req.params.movietitle });
//         console.log("M:",movie);
//         if (!movie) {
//             console.log("Movie not found");
//             return res.status(404).send('Movie not found');
//         }

//         // If movie is found, render the bookShow page and pass the movie data
//         res.render('bookShow', { movie });
//     } catch (err) {
//         // Log the error and return a 500 response for server errors
//         console.error(err);
//         res.status(500).send('Server Error 1');
//     }
// });
// const express = require('express');
// const router = express.Router();
// const Movie = require('./models/Movie'); // Assuming the model is in models/movie.js

module.exports = router;


// Render booking page for a specific movie
router.get('/book/:title', async (req, res) => {
    try {
        console.log("titles..");
        const movie = await Movie.findOne({ title: req.params.title });
        res.render('book', { movie });
    } catch (err) {
        res.status(500).send('Error loading booking page');
    }
});
// const express = require('express');
// const app = express();
// const Movie = require('./models/Movie'); // Path to your Movie model

// Route to fetch and display movie details by title
// app.get('/book/:title', async (req, res) => {
//     console.log(req.params.title);
//     try {
//         console.log(req.params.title);
//         const movieTitle = req.params.title;
//         console.log(movieTitle);
//         const movie = await Movie.findOne({ title: movieTitle });
        
//         if (!movie) {
//             return res.status(404).send('Movie not found');
//         }
        
//         res.render('book', { movie });
//     } catch (error) {
//         res.status(500).send('An error occurred while retrieving movie details');
//     }
// });


app.post('/book/:title/seat', async (req, res) => {
    const { seats, showtime, theatreName } = req.body;
    try {
        // Fetch the movie by title
        console.log("Theatre name",theatreName);
        const movie = await Movie.findOne({ title: req.params.title });
        
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        // Find the selected theatre and showtime
        const theatre = movie.theatres.find(t => t.name === theatreName);
        if (!theatre) {
            return res.status(404).send('Theatre not found');
        }

        const selectedShowtime = theatre.showtimes.find(st => st.time === showtime);
        if (!selectedShowtime) {
            return res.status(404).send('Showtime not found');
        }

        // Ensure that the seats are not already booked
        const alreadyBookedSeats = selectedShowtime.bookedSeats;
        const newSeats = seats.map(Number).filter(seat => !alreadyBookedSeats.includes(seat));

        if (newSeats.length === 0) {
            return res.status(400).send('All selected seats are already booked');
        }

        // Update booked seats
        selectedShowtime.bookedSeats.push(...newSeats);

        // Save the updated movie document
        await movie.save();

        // Redirect to the payment page
        res.redirect(`/payment/${movie.title}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while processing your request');
    }
});



  module.exports = router;




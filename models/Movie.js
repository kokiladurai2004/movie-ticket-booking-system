const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Movie Schema (with embedded theatres and required fields)
const MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    posterUrl: {
        type: String,
        required: true
    },
    // Theatres are directly embedded in the Movie schema as an array
    theatres: [
        {
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            availableSeats: {
                type: Number,
                required: true
            },
            showtimes: [
                {
                    time: {
                        type: String,
                        required: true
                    },
                    bookedSeats: {
                        type: [Number], // Array of seat numbers that are booked
                        required: true
                    }
                }
            ]
        }
    ]
});

// Create the Movie model
const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;


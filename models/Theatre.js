// // Theatre Model
// const mongoose = require("mongoose");

// const theatreSchema = new mongoose.Schema({
//     name: String,
//     location: String,
//     movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
//     seats: [
//         {
//             seatNumber: String,
//             isAvailable: { type: Boolean, default: true }
//         }
//     ]
// });

// const Theatre = mongoose.model("Theatre", theatreSchema);
// module.exports = Theatre;
// models/Theatre.js
const mongoose = require('mongoose');

// Define the Theatre Schema
const theatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },  // Reference to the Movie model
    seats: [
        {
            seatNumber: String,
            isAvailable: { type: Boolean, default: true }
        }
    ]
}, { timestamps: true });

// Create and export the Theatre model
const Theatre = mongoose.model('Theatre', theatreSchema);
module.exports = Theatre;


// const theatreSchema = new mongoose.Schema({
//     name: String,
//     location: String,
//     movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },  // Ensure the movieId is correctly populated
//     seats: [
//         {
//             seatNumber: String,
//             isAvailable: { type: Boolean, default: true }
//         }
//     ]
// });




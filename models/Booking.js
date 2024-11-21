// // models/Booking.js
// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   movieName: String,
//   theater: String,
//   showTime: Date,
//   seats: [String],
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   paymentStatus: String,
// });

// module.exports = mongoose.model('Booking', bookingSchema);


const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
//   bookingDate: { type: Date, default: Date.now },
//   seats: Number, // Number of seats booked
// });

// module.exports = mongoose.model('Booking', bookingSchema);


// Booking Model
const bookingSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre' },
    seatsBooked: [String], // List of booked seat numbers
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;


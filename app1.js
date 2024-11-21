// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const MONGODB_URI = "mongodb://localhost:27017/movietickets";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(error => console.log("MongoDB connection error:", error));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Setting EJS as the templating engine
app.use(express.static('public')); // To serve static files like CSS

app.use(express.static('views/image'));  // or adjust path according to your structure


// Define a Movie model
// const movieSchema = new mongoose.Schema({
//   title: String,
//   genre: String,
//   description: String,
//   theater: String,
//   showtime: Date,
//   price: Number
// });

const movieSchema = new mongoose.Schema({
    title: String,
    genre: String,
    description: String,
    theater: String,
    showtime: Date,
    price: Number,
    language: String // Add language field
});

const Movie = mongoose.model('Movie', movieSchema);

// Define a Booking model
const bookingSchema = new mongoose.Schema({
  user: String,
  movieId: mongoose.Schema.Types.ObjectId,
  seats: Number,
  bookingDate: Date
});
const Booking = mongoose.model('Booking', bookingSchema);

// Sample movies
const sampleMovies = [
    { 
      title: "Inception", 
      genre: "Sci-Fi", 
      description: "A mind-bending thriller about dreams within dreams.", 
      theater: "Theater 1", 
      showtime: new Date('2024-11-15T18:00:00'), 
      price: 10,
      language: "English" // Added language field
    },
    { 
      title: "The Dark Knight", 
      genre: "Action", 
      description: "A gritty portrayal of Batman taking on Joker.", 
      theater: "Theater 2", 
      showtime: new Date('2024-11-16T20:00:00'), 
      price: 12,
      language: "English" // Added language field
    },
    { 
      title: "Interstellar", 
      genre: "Sci-Fi", 
      description: "An epic journey through space and time.", 
      theater: "Theater 3", 
      showtime: new Date('2024-11-17T21:00:00'), 
      price: 15,
      language: "English" // Added language field
    }
  ];
  
//   const Movie = mongoose.model('Movie', movieSchema);

  async function insertSampleMovies() {
    try {
      await Movie.insertMany(sampleMovies);
      console.log("Sample movies added to the database.");
    } catch (err) {
      console.log("Error inserting sample movies:", err);
    }
  }
  
  // Call the function to insert the sample movies
  insertSampleMovies();
  
// Function to insert sample movies if the database is empty
// async function insertSampleMovies() {
//   const movieCount = await Movie.countDocuments();
//   if (movieCount === 0) {
//     await Movie.insertMany(sampleMovies);
//     console.log("Sample movies inserted");
//   }
// }

// // Call the function to insert sample movies
// insertSampleMovies().catch(error => console.log("Error inserting sample movies:", error));

// Routes
// Home route to display available movies
// app.get('/', async (req, res) => {
//   try {
//     const movies = await Movie.find();
//     res.render('index', { movies });
//   } catch (err) {
//     res.status(500).send("Error fetching movies");
//   }
// });
// Home route to display available movies with filtering and sorting
app.get('/', async (req, res) => {
    try {
        const { language, genre, sort } = req.query; // Get filter options from query params

        let filter = {}; // Initialize filter object
        if (language && language !== 'all') filter.language = language; // Filter by language
        if (genre && genre !== 'all') filter.genre = genre; // Filter by genre

        let sortBy = {}; // Initialize sorting object
        if (sort === 'old-to-new') {
            sortBy.showtime = 1; // Sort by showtime: old to new
        } else if (sort === 'new-to-old') {
            sortBy.showtime = -1; // Sort by showtime: new to old
        }

        // Fetch the filtered and sorted movies from the database
        const movies = await Movie.find(filter).sort(sortBy);

        // Render the movies on the index page
        res.render('index', { movies });
    } catch (err) {
        res.status(500).send("Error fetching movies");
    }
});


// Route to display booking form for a selected movie
app.get('/book/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.render('book', { movie });
  } catch (err) {
    res.status(500).send("Error fetching movie details");
  }
});

// Route to handle booking form submission
app.post('/book/:id', async (req, res) => {
  try {
    const booking = new Booking({
      user: req.body.user,
      movieId: req.params.id,
      seats: req.body.seats,
      bookingDate: new Date()
    });
    await booking.save();
    res.send("Booking successful!");
  } catch (err) {
    res.status(500).send("Error saving booking");
  }
});

// Route to view booking history
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('movieId');
    res.render('bookings', { bookings });
  } catch (err) {
    res.status(500).send("Error fetching bookings");
  }
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const session = require("express-session");
// const userRoutes = require("./routes/userRoutes");

// const app = express();
// app.set("view engine", "ejs");

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// // Session setup
// app.use(session({
//     secret: "yourSecretKey",
//     resave: false,
//     saveUninitialized: true
// }));

// // Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/movieDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//     // useCreateIndex: true
// }).then(() => console.log("Connected to MongoDB"))
//   .catch((error) => console.error("MongoDB connection error:", error));

// // Routes

// const homeRoutes = require('./routes/homeRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');

// app.use("/", userRoutes);
// app.use('/', homeRoutes);
// app.use('/', bookingRoutes);


// // Home route
// app.get("/", (req, res) => {
//     if (req.session.userId) {
//         // User is logged in
//         res.render("index");
//     } else {
//         // User is not logged in
//         // res.redirect("/login");
//         res.render("index");
//     }
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require('./routes/movieRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const Movie = require('./models/Movie');
const path = require('path');

const app = express();
app.set("view engine", "ejs");

app.set('views', path.join(__dirname, 'views'));  // Ensure this path is correct
// app.set('views', path.join(__dirname, 'src', 'views'));

// Use the movie routes for requests to the root path




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(express.static('public'));

// Session setup
app.use(session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/movieDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
const homeRoutes = require('./routes/homeRoutes');
// const movieRoutes = require('./routes/movieRoutes');

app.use("/", userRoutes);
app.use('/', homeRoutes);
// app.use('/', bookingRoutes);
app.use('/', movieRoutes);  // This applies the router to the "/" route
app.use('/', paymentRoutes);


// Home route (check login session)
app.get("/", (req, res) => {
    // res.render("index");
    // console.log("Session UserID:", req.session.userId); // Debug log to check session

    if (req.session.userId) {
        // User is logged in, render home.ejs
        res.render("home");
    } else {
        // User is not logged in, render index.ejs
        res.render("index");
    }
});

// Payment route
app.get('/payment', (req, res) => {
    const { movie, theatre, showtime, seats, amount } = req.query;
    res.render('payment', { movie, theatre, showtime, seats, amount });
});



app.get('/book/:id', async (req, res) => {
    try {
        // Find movie by ID
        const movie = await Movie.findById(req.params.id);
        
        if (!movie) {
            console.log("movie:",movie);
            return res.status(404).send('Movie not found');
        }
        
        // Render the movie details and show theatres
        res.render('book', { movie });
    } catch (err) {
        res.status(500).send('Error retrieving movie details');
    }
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); // Import the Movie model
const PDFDocument = require('pdfkit'); // Import PDFKit
const fs = require('fs'); // Import file system

// POST route to process payment and update booked seats
router.post('/processPayment', async (req, res) => {
    console.log(req.body); // Debugging step
    const { movieTitle, theatreId, showtime, seats, amount } = req.body;

    if (!seats) {
        return res.status(400).send("Seats parameter is missing.");
    }
    // const { movieTitle, theatreId, showtime, seats, amount } = req.body;

    const seatNumbers = seats.split(',').map(seat => parseInt(seat.trim()));

    try {
        const updatedMovie = await Movie.findOneAndUpdate(
            {
                title: movieTitle,
                'theatres.name': theatreId,
                'theatres.showtimes.time': showtime
            },
            {
                $push: {
                    'theatres.$[theatre].showtimes.$[showtime].bookedSeats': { $each: seatNumbers }
                }
            },
            {
                arrayFilters: [
                    { 'theatre.name': theatreId },
                    { 'showtime.time': showtime }
                ],
                new: true
            }
        );

        if (!updatedMovie) {
            return res.status(404).send('Movie or showtime not found');
        }

        res.redirect(`/paymentSuccess?movie=${movieTitle}&theatre=${theatreId}&showtime=${showtime}&seats=${seats}&amount=${amount}`);
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).send('Internal server error');
    }
});

// Helper function to create PDF
function createPDF(movie, theatre, showtime, seats, amount, res) {
    const doc = new PDFDocument();
    const fileName =`Booking_Details_${movie.replace(/\s+/g, '_')}.pdf`;
    const filePath = `./${fileName}`;

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(24).text('Payment Successful', { align: 'center' });
    doc.fontSize(16).moveDown().text(`Movie: ${movie}`);
    doc.text(`Theatre: ${theatre}`);
    doc.text(`Showtime: ${showtime}`);
    doc.text(`Seats: ${seats}`);
    doc.text(`Amount Paid: ₹${amount}`);
    doc.end();

    doc.on('finish', () => {
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error downloading PDF:', err);
            }
            fs.unlinkSync(filePath);
        });
    });
}
router.get('/paymentSuccess', (req, res) => {
    const { movie, theatre, showtime, seats, amount } = req.query;

    res.send(`
        <!DOCTYPE html>
<html>
<head>
    <title>Payment Success</title>
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Global body styles */
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background: linear-gradient(to right, #f8ffea, #c2ffd8);
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        /* Navbar styles */
        header {
            background-color: #222;
            color: #f5c518;
            padding: 1em 0;
            width: 100%;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2em;
        }

        .navbar h1 {
            font-size: 1.8em;
            color: #f5c518;
            font-family: 'Georgia', serif;
            text-shadow: 1px 1px 2px #000;
        }

        .navbar ul {
            list-style-type: none;
            display: flex;
        }

        .navbar li {
            margin: 0 15px;
        }

        .navbar a {
            color: #f5c518;
            text-decoration: none;
            font-size: 1em;
            font-weight: bold;
            transition: color 0.3s;
        }

        .navbar a:hover {
            color: #ffd700;
        }

        /* Centering main content */
        .main-content {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-grow: 1;
        }

        /* Container styling for the success message */
        .container {
            background-color: #fff;
            padding: 30px;
            width: 350px;
            text-align: center;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
            animation: fadeIn 1s ease-in-out;
            margin-top: 20px;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }

        .checkmark {
            font-size: 50px;
            color: #4CAF50;
            margin-bottom: 15px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        h1 {
            color: #4CAF50;
            font-size: 26px;
            margin-bottom: 15px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }

        p {
            font-size: 18px;
            color: #555;
            line-height: 1.5;
            margin: 10px 0;
        }

        .highlight {
            font-weight: bold;
            color: #333;
        }
    </style>
</head>
<body>
    <header>
        <nav class="navbar">
            <h1>Movie Tickets</h1>
            <ul>
                <li><a href="/index">Logout</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="main-content">
        <div class="container">
            <div class="checkmark">✔</div>
            <h1>Payment Successful</h1>
            <p>Your payment of <span class="highlight">₹${amount}</span> for <span class="highlight">${movie}</span> at <span class="highlight">${theatre}</span> on <span class="highlight">${showtime}</span> with seat numbers <span class="highlight">${seats}</span> has been processed successfully.</p>
        </div>
    </div>
</body>
</html>

    `);
});


router.get('/downloadPDF', (req, res) => {
    const { movie, theatre, showtime, seats, amount } = req.query;
    createPDF(movie, theatre, showtime, seats, amount, res);
});

module.exports = router;

let selectedSeats = [];

// Function to update showtimes based on selected theatre
function updateShowtimes() {
    const selectedTheatre = document.getElementById('theatreSelect').value;
    console.log("ust",selectedTheatre);
    if (!selectedTheatre){
         console.log("ust");
        return; 

    }   // Do nothing if no theatre is selected

    const theatreDetails = JSON.parse(selectedTheatre);
    const showtimeContainer = document.getElementById('showtimes');
    const seatsInput = document.getElementById('seatsInput');

    // Clear previous showtimes and seats options
    showtimeContainer.innerHTML = '';
    seatsInput.max = theatreDetails.availableSeats;

    // Display new showtimes
    theatreDetails.showtimes.forEach(showtime => {
        const li = document.createElement('li');
        li.innerHTML = `<label>
            <input type="radio" name="showtime" value="${showtime.time}" required>
            ${showtime.time}
        </label>`;
        showtimeContainer.appendChild(li);
    });

    // Generate seating layout for the selected showtime
    generateSeatingLayout(theatreDetails);
}

// Function to generate seating layout for the selected showtime
function generateSeatingLayout(theatreDetails) {
    const numSeats = parseInt(document.getElementById('seatsInput').value);
    const layoutContainer = document.getElementById('seatingLayout');
    layoutContainer.innerHTML = ''; // Clear any previous layout

    if (numSeats > 0 && theatreDetails) {
        const bookedSeats = new Set(); // Use a Set for easy lookup of booked seats

        // Collect all booked seats across showtimes for the selected theatre
        theatreDetails.showtimes.forEach(showtime => {
            showtime.bookedSeats.forEach(seat => {
                bookedSeats.add(seat); // Add each booked seat to the Set
            });
        });

        let seatCount = 0;
        const rowCount = 5; // Example: 5 rows
        const colCount = 10; // Example: 10 seats per row

        // Generate the layout (simple grid)
        for (let i = 0; i < rowCount; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < colCount; j++) {
                const seat = document.createElement('button');
                seat.classList.add('seat');
                seat.innerText = seatCount + 1;

                // Disable the seat if it's already booked
                seat.disabled = bookedSeats.has(seatCount);

                seat.addEventListener('click', () => selectSeat(seat, seatCount));
                row.appendChild(seat);
                seatCount++;
            }
            layoutContainer.appendChild(row);
        }
    }
}

// Function to select and update seat selection
function selectSeat(seat, seatNumber) {
    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(num => num !== seatNumber);
    } else {
        seat.classList.add('selected');
        selectedSeats.push(seatNumber);
    }
}

// Show the summary of selected seats and total amount
function showSummary() {
    console.log("Clicked");
    const amount = selectedSeats.length * 150; // 150 rupees per seat
    const summaryContainer = document.getElementById('summary');
    const seatsSummary = selectedSeats.map(seat => `Seat ${seat + 1}`).join(', ');

    summaryContainer.innerHTML = `
        <h3>Booking Summary</h3>
        <p><strong>Movie:</strong> <%= movie.title %></p>
        <p><strong>Selected Seats:</strong> ${seatsSummary}</p>
        <p><strong>Total Amount:</strong> ₹${amount}</p>
        <button onclick="proceedToPayment()">Proceed to Payment</button>
    `;
}

// Placeholder function for proceeding to payment
function proceedToPayment() {
    alert("Proceeding to Payment");
}

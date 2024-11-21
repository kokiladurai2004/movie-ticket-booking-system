document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById("movieList");

    // Mock movie data
    const movies = [
        { title: "Inception", poster: "https://via.placeholder.com/150", description: "A mind-bending thriller by Christopher Nolan." },
        { title: "Avatar", poster: "https://via.placeholder.com/150", description: "An epic science fiction film directed by James Cameron." },
        { title: "The Dark Knight", poster: "https://via.placeholder.com/150", description: "A superhero film directed by Christopher Nolan." }
    ];

    // Render each movie
    movies.forEach(movie => {
        const movieItem = document.createElement("div");
        movieItem.classList.add("movie-item");

        movieItem.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <h4>${movie.title}</h4>
            <p>${movie.description}</p>
            <button onclick="bookMovie('${movie.title}')">Book Now</button>
        `;
        
        movieList.appendChild(movieItem);
    });
});

// Sample function for booking (redirect or alert)
function bookMovie(title) {
    alert(`You selected ${title}!`);
    // In a real app, redirect to booking page for the selected movie
    // window.location.href = /book?movie=${title};
}
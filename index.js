import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, get, update, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { Movie } from "/movie/movie.js";

const firebaseConfig = {
    databaseURL: 'https://movie-tickets-d75f8-default-rtdb.europe-west1.firebasedatabase.app/',
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const moviesRef = ref(database, "movies");

document.addEventListener("DOMContentLoaded", loadMovies);

async function loadMovies() {
    const snapshot = await get(moviesRef);
    const moviesContainer = document.getElementById("movies-container");

    if (snapshot.exists()) {
        const movies = snapshot.val();
        moviesContainer.innerHTML = "";

        Object.keys(movies).forEach((id) => {
            const movieData = movies[id];
            const movie = new Movie(movieData.name, movieData.seats, movieData.seatsBooked);
            const remainingSeats = movie.getRemainingSeats();

            const movieElement = document.createElement("div");
            movieElement.classList.add("movie");

            movieElement.innerHTML = `
                <h3>${movie.name}</h3>
                <p>Seats Available: ${remainingSeats}</p>
                <div class="input">
                    <button id='book${id}' class="button" ">Book a Seat</button>
                    <input type="number" id='quantity${id}' class="inputNumber" min="1" value="1">
                </div>
            `;
            moviesContainer.appendChild(movieElement);
            document.getElementById(`book${id}`).addEventListener("click", () => bookSeat(id))
        });
    } else {
        moviesContainer.innerHTML = "<p>No movies available.</p>";
    }
}

window.bookSeat = async function (id) {
    const movieRef = child(moviesRef, id);
    const snapshot = await get(movieRef);

    if (snapshot.exists()) {
        const movieData = snapshot.val();
        const movie = new Movie(movieData.name, movieData.seats, movieData.seatsBooked);
        const quantity = document.getElementById(`quantity${id}`).value;
        if (movie.bookSeats(Number(quantity))) {
            await update(movieRef, { "seatsBooked": movie.seatsBooked});
            loadMovies();
        } else {
            alert("Not enough seats available.");
        }
    } else {
        alert("Movie not found.");
    }
};

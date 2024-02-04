const express = require("express");
const morgan = require("morgan");
const app = express();
// Define an array with data about the top 10 movies
const topMovies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: 1972,
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    director: "Peter Jackson",
    year: 2003,
  },
  {
    title: "Schindler's List",
    director: "Steven Spielberg",
    year: 1993,
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
    year: 1994,
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
  },
  {
    title: "The Matrix",
    director: "The Wachowskis",
    year: 1999,
  },
  {
    title: "Citizen Kane",
    director: "Orson Welles",
    year: 1941,
  },
];

// Create an Express GET route at the endpoint "/movies"
app.get("/movies", (req, res) => {
  // Return the JSON object containing data about your top 10 movies
  res.json(topMovies);
});

// GET route for "/"
app.get("/", (req, res) => {
  res.send("Welcome to my Movie API!"); // Replace with your desired default response
});

// Serve static files from the "public" folder
app.use(express.static("public"));

// Use Morgan middleware for logging requests
app.use(morgan("dev"));

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Respond with a generic error message
  res.status(500).send("Something went wrong!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});

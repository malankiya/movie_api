const express = require("express");
const app = express();
const bodyParser = require("body-parser");
uuid = require("uuid");

app.use(bodyParser.json());
// Define an array with users
let users = [
  (id = "1"),
  (Name = "joe"),
  (Favouritemovie = []),
  (id = "2"),
  (Name = "joni"),
  (Favouritemovie = ["Pulp Fiction"]),
];
// Define an array with data about the top 10 movies
const topMovies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genre: "action",
    phase: "1",
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: 1972,
    genre: "action",
    phase: "2",
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genre: "action",
    phase: "3",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: 1994,
    genre: "action",
    phase: "4",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    director: "Peter Jackson",
    year: 2003,
    genre: "action",
    phase: "5",
  },
  {
    title: "Schindler's List",
    director: "Steven Spielberg",
    year: 1993,
    genre: "action",
    phase: "6",
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
    year: 1994,
    genre: "action",
    phase: "7",
  },
  {
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genre: "action",
    phase: "8",
  },
  {
    title: "The Matrix",
    director: "The Wachowskis",
    year: 1999,
    genre: "action",
    phase: "9",
  },
  {
    title: "Citizen Kane",
    director: "Orson Welles",
    year: 1941,
    genre: "action",
    phase: "10",
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

// Gets the data about a single movie, by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send("Movie not found");
  }
});
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

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

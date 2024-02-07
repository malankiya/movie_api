const { update } = require("lodash");

const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  uuid = require("uuid");

app.use(bodyParser.json());
// Define an array with users
let users = [
  {
    id: 1,
    Name: "joe",
    Favouritemovie: [],
  },
  {
    id: 2,
    Name: "jon",
    Favouritemovie: ["The Shawshank Redemption"],
  },
];
// Define an array with data about the movies
const topMovies = [
  {
    title: "The Shawshank Redemption",
    year: 1994,
    movieUrl: "https://www.themoviedb.org/movie/278-the-shawshank-redemption ",
    Director: "Frank Darabont",
    Director: {
      Name: "Frank Darabont",
      year: 1991,
      bio: "Frank Darabont is an American filmmaker, screenwriter, producer, and actor. He is known for his nonlinear storytelling, stylized dialogue, and eclectic film influences.",
    },
    genre: {
      Name: "Thriller",
      birth: 1987,
      bio: "Frank Darabont is a Hungarian-American film director, screenwriter, and producer. He is best known for his work in the horror genre, particularly adaptations of Stephen King's novels. Besides 'The Shawshank Redemption,' Darabont directed other acclaimed films like 'The Green Mile' and 'The Mist.'",
    },
  },
  {
    title: "The Godfather",
    year: 1972,
    movieUrl: "https://www.themoviedb.org/movie/238-the-godfather ",
    Director: {
      Name: "Francis Ford Coppola",
      year: 1992,
      bio: "Francis Ford Coppola is an American filmmaker, screenwriter, producer, and actor. He is known for his nonlinear storytelling, stylized dialogue, and eclectic film influences.",
    },
    genre: {
      Name: "fiction",
      birth: 1965,
      bio: "Francis Ford Coppola is an American film director, producer, and screenwriter. He is widely regarded as one of the greatest filmmakers in Hollywood history. In addition to directing 'The Godfather' trilogy, Coppola directed iconic films such as 'Apocalypse Now' and 'The Conversation.'",
    },
  },
  {
    title: "The Dark Knight",
    year: 2008,
    movieUrl: "https://www.themoviedb.org/movie/155-the-dark-knight ",
    Director: {
      Name: "Christopher Nolan",
      year: 1993,
      bio: "Christopher Nolan is an American filmmaker, screenwriter, producer, and actor. He is known for his nonlinear storytelling, stylized dialogue, and eclectic film influences.",
    },

    genre: {
      Name: "Science fiction",
      birth: 1967,
      bio: "Christopher Nolan is a British-American filmmaker known for his distinctive storytelling and complex narratives. In addition to directing 'The Dark Knight' trilogy, Nolan directed mind-bending films like 'Inception,' 'Interstellar,' and 'Dunkirk.'",
    },
  },
  {
    title: "Pulp Fiction",
    year: 1994,
    movieUrl: "https://www.themoviedb.org/movie/680-pulp-fiction",
    Director: {
      Name: "Quentin Tarantino",
      year: 1994,
      bio: "Quentin Tarantino is an American filmmaker, screenwriter, producer, and actor. He is known for his nonlinear storytelling, stylized dialogue, and eclectic film influences.",
    },
    genre: {
      Name: "Action",
      birth: 1970,
      bio: "In addition to 'Pulp Fiction,' Tarantino directed 'Reservoir Dogs,' 'Kill Bill,' and 'Django Unchained.'",
    },
  },
  {
    title: "Schindler's List",
    year: 1993,
    movieUrl: "https://www.themoviedb.org/movie/424-schindler-s-list ",
    Director: {
      Name: "Steven Spielberg",
      year: 1993,
      bio: "Steven Spielberg is an American filmmaker, screenwriter, producer, and actor. He is known for his nonlinear storytelling, stylized dialogue, and eclectic film influences.",
    },
    genre: {
      Name: "Drama",
      birth: 1975,
      bio: "Steven Spielberg is an American film director, producer, and screenwriter. He is one of the most successful and influential directors in the history of cinema. Spielberg has directed numerous blockbuster films, including 'Jaws,' 'E.T. the Extra-Terrestrial,' and 'Jurassic Park.' 'Schindler's List' is a powerful drama that earned Spielberg an Academy Award for Best Director.",
    },
  },
];

// Allow new users to register;

app.post("/users", (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("users need names");
  }
});

// update the data
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("such user not found");
  }
});

//Allow users to add a movie to their list of favorites
app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.Favouritemovie.push(movieTitle); // Update the property name here
    res.status(200).send(`${movieTitle} has been added to user  ${id}'s array`);
  } else {
    res.status(400).send("user not found");
  }
});

//DELETE
app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.Favouritemovie = user.Favouritemovie.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been remove from user  ${id}'s array`);
  } else {
    res.status(400).send("user not found");
  }
});

//Allow existing users to deregister
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.send(` user  ${id} has been deleted`);
  } else {
    res.status(400).send("user not found");
  }
});

// Create an Express GET route at the endpoint "/movies"
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// Gets the data about a single movie, by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = topMovies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("Movie not found");
  }
});

// Gets the data about a genre, by genrename
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = topMovies.find((movie) => movie.genre.Name === genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send(" not found genre");
  }
});

// Return data about a genre (description)
app.get("/movies/directors/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = topMovies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send(" not found director");
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  //   Respond with a generic error message
  res.status(500).send("Something went wrong!");
});

// listen for requests
app.listen(3000, () => {
  console.log("Your app is listening on port 3000.");
});

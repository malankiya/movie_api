const mongoose = require("mongoose");
const Models = require("./models.js");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
const uuid = require("uuid");

// connection with Mongoose
mongoose
  .connect("mongodb://localhost:27017/db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));

// Import Mongoose models
const User = Models.User;
const Movie = Models.Movie;

// Get all Movies from the database
app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// get single movie by movieName
app.get("/movies/:movieName", async (req, res) => {
  const { movieName } = req.params;

  try {
    const movie = await Movie.findOne({ movieName: movieName });

    if (movie) {
      const movieData = {
        genre: movie.genre,
        director: movie.director,
        movieid: movie.movieid,
        birthdate: movie.birthdate,
        description: movie.description,
        movieName: movie.movieName,
        bio: movie.bio,
      };

      res.json(movieData);
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// ger description by genreName
app.get("/movies/genre/:genreName", async (req, res) => {
  const { genreName } = req.params;

  try {
    const movie = await Movie.findOne(
      { genre: genreName },
      "genre description"
    );

    if (movie) {
      res.json({ genre: movie.genre, description: movie.description });
    } else {
      res.status(404).send("Genre not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// Return data about a director
app.get("/directors/:directorName", async (req, res) => {
  const { directorName } = req.params;

  try {
    const movie = await Movie.findOne(
      { director: directorName },
      "director birthdate bio"
    );

    if (movie) {
      res.json({
        director: movie.director,
        birthdate: movie.birthdate,
        bio: movie.bio,
      });
    } else {
      res.status(404).send("Director not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all users from the database
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// CREATE
app.post("/users", async (req, res) => {
  try {
    const existingUser = await User.findOne({ firstName: req.body.firstName });

    if (existingUser) {
      return res.status(400).send(req.body.firstName + " already exists");
    }

    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      favorite_movie: [],
      birthday: req.body.birthday,
    });

    console.log(newUser);

    if (newUser) {
      res.status(201).json(newUser);
    } else {
      console.error("Error creating user: newUser is falsy");
      res.status(500).send("Error creating user");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user: " + error.message); // Log the error message
  }
});
// Get a user by firstName
app.get("/users/:firstName", async (req, res) => {
  await User.findOne({ firstName: req.params.firstName })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});
// Update
app.put("/users/:_id", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params._id },
      {
        $set: {
          firstName: req.body.firstName,
        },
      },
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: " + error.message);
    console.log("no updation");
  }
});

// Add a movie to a user's list of favorites
app.post("/users/:firstName/movies/:movieid", async (req, res) => {
  await User.findOneAndUpdate(
    { firstName: req.params.firstName },
    {
      $push: { favorite_movie: req.params.movieid },
    },
    { new: true }
  ) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:" + err);
    });
});

// Delete a user by username
app.delete("/users/:firstName", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      firstName: req.params.firstName,
    });

    if (!deletedUser) {
      res.status(400).send(req.params.firstName + " was not found");
    } else {
      res.status(200).send(req.params.firstName + " was deleted.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// // // Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  //   //   Respond with a generic error message
  res.status(500).send("Something went wrong!");
});

// listen for requests
app.listen(8000, () => {
  console.log("Your app is listening on port 8000.");
});

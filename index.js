const mongoose = require("mongoose");
const Models = require("./models.js");
require("dotenv").config();
const { check, validationResult } = require("express-validator");
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

let allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:8000",
  "https://myflixapp-cw0r.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

//Import auth.js
let auth = require("./auth")(app);

app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.urlencoded({ extended: true }));

// Import passport and passport.js
const passport = require("passport");
require("./passport");

//Load documentation page
app.use(express.static("public"));

const uuid = require("uuid");

mongoose
  .connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));

// // connection with Mongoose
// mongoose
//   .connect("mongodb://localhost:27017/db", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log("Mongo Error", err));

// Import Mongoose models
const User = Models.User;
const Movie = Models.Movie;
app.get("/", (req, res) => {
  res.json("hello my FlixAPI");
});
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movie.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);
// Add a movie to a user's list of favorites
app.post(
  "/users/:userName/movies/:movieid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await User.findOneAndUpdate(
      { userName: req.params.userName },
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
  }
);
// Return data about a director
app.get(
  "/directors/:directorName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);
// get description by genreName
app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);
// get single movie by movieName
app.get(
  "/movies/:movieName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
  }
);

// READ user list
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await User.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Update
app.put(
  "/users/:userName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let hashedPassword = User.hashPassword(req.body.password);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { userName: req.params.userName },
        {
          $set: {
            email: req.body.email,
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
  }
);

// Get a user by userName
app.get(
  "/users/:userName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await User.findOne({ userName: req.params.userName })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// CREATE
app.post(
  "/users",
  [
    check("userName", "userName is required").isLength({ min: 5 }),
    check(
      "userName",
      "userName contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("password", "password is required").not().isEmpty(),
    check("email", "email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    try {
      // check the validation object for errors
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      let hashedPassword = User.hashPassword(req.body.password);
      const existingUser = await User.findOne({ userName: req.body.userName });

      if (existingUser) {
        return res.status(400).send(req.body.userName + " already exists");
      }

      const newUser = await User.create({
        userName: req.body.userName,
        password: hashedPassword,
        email: req.body.email,
        birthday: req.body.birthday,
        favoritemovie: [],
      });

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
  }
);

// Delete a user by username
app.delete("/users/:userName", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      userName: req.params.userName,
    });

    if (!deletedUser) {
      res.status(400).send(req.params.userName + " was not found");
    } else {
      res.status(200).send(req.params.userName + " was deleted.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  }
});

// // // // Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  //   //   //   Respond with a generic error message
  res.status(500).send("Something went wrong!");
});

// listen for requests
const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});

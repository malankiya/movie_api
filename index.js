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
// // Allow new users to register;

// app.post("/users", (req, res) => {
//   const newUser = req.body;

//   if (newUser.name) {
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser);
//   } else {
//     res.status(400).send("users need names");
//   }
// });

// // update the data
// app.put("/users/:id", (req, res) => {
//   const { id } = req.params;
//   const updatedUser = req.body;

//   let user = users.find((user) => user.id == id);

//   if (user) {
//     user.name = updatedUser.name;
//     res.status(200).json(user);
//   } else {
//     res.status(400).send("such user not found");
//   }
// });

// //Allow users to add a movie to their list of favorites
// app.post("/users/:id/:movieTitle", (req, res) => {
//   const { id, movieTitle } = req.params;

//   let user = users.find((user) => user.id == id);

//   if (user) {
//     user.Favouritemovie.push(movieTitle); // Update the property name here
//     res.status(200).send(`${movieTitle} has been added to user  ${id}'s array`);
//   } else {
//     res.status(400).send("user not found");
//   }
// });

// //DELETE
// app.delete("/users/:id/:movieTitle", (req, res) => {
//   const { id, movieTitle } = req.params;

//   let user = users.find((user) => user.id == id);

//   if (user) {
//     user.Favouritemovie = user.Favouritemovie.filter(
//       (title) => title !== movieTitle
//     );
//     res
//       .status(200)
//       .send(`${movieTitle} has been remove from user  ${id}'s array`);
//   } else {
//     res.status(400).send("user not found");
//   }
// });

// //Allow existing users to deregister
// app.delete("/users/:id", (req, res) => {
//   const { id } = req.params;

//   let user = users.find((user) => user.id == id);

//   if (user) {
//     users = users.filter((user) => user.id != id);
//     res.send(`user${id} has been deleted`);
//   } else {
//     res.status(400).send("user not found");
//   }
// });

// // Create an Express GET route at the endpoint "/movies"
// app.get("/movies", (req, res) => {
//   res.json(topMovies);
// });

// // Gets the data about a single movie, by title
// app.get("/movies/:title", (req, res) => {
//   const { title } = req.params;
//   const movie = topMovies.find((movie) => movie.title === title);

//   if (movie) {
//     res.status(200).json(movie);
//   } else {
//     res.status(400).send("Movie not found");
//   }
// });

// // Gets the data about a genre, by genrename
// app.get("/movies/genre/:genreName", (req, res) => {
//   const { genreName } = req.params;
//   const genre = topMovies.find((movie) => movie.genre.Name === genreName).genre;

//   if (genre) {
//     res.status(200).json(genre);
//   } else {
//     res.status(400).send(" not found genre");
//   }
// });

// // Return data about a genre (description)
// app.get("/movies/directors/:directorName", (req, res) => {
//   const { directorName } = req.params;
//   const director = topMovies.find(
//     (movie) => movie.Director.Name === directorName
//   ).Director;

//   if (director) {
//     res.status(200).json(director);
//   } else {
//     res.status(400).send(" not found director");
//   }
// });

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

const mongoose = require("mongoose");
const Models = require("./models.js");
const express = require("express");
const app = express();

//Import auth.js
let auth = require("./auth");

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

// Import passport and passport.js
const passport = require("passport");
require("./passport");

//Load documentation page
app.use(express.static("public"));

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

// READ user list
app.get("/users", async (req, res) => {
  await User.find()
    .then((users) => {
      res.status(201).json(users);
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
});

// Get a user by firstName
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
app.post("/users", async (req, res) => {
  try {
    const existingUser = await User.findOne({ userName: req.body.userName });

    if (existingUser) {
      return res.status(400).send(req.body.userName + " already exists");
    }

    const newUser = await User.create({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      birthday: req.body.birthday,
      favoritemovie: [],
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

// // // // Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  //   //   //   Respond with a generic error message
  res.status(500).send("Something went wrong!");
});

// listen for requests
app.listen(8000, () => {
  console.log("Your app is listening on port 8000.");
});

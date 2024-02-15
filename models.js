const mongoose = require("mongoose");
let movieSchema = mongoose.Schema({
  // Defining the Schema

  genre: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  movieid: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  movieName: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
});

let userSchema = mongoose.Schema({
  // Defining the Schema

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  favorite_movie: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  birthday: Date,
});

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

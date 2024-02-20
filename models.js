const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

  userName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoritemovie: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

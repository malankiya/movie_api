require("dotenv").config();

const jwtSecret = process.env.SECRET_KEY;

// // Check if the secretKey is defined
if (!jwtSecret) {
  console.error("Error: secretKey not defined.");
  process.exit(1); // Exit the application if the secret key is not defined.
}

console.log("jwtSecret", jwtSecret);

const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport");

function generateJWTToken(user) {
  console.log("jwtSecret:", jwtSecret);
  return jwt.sign(user, jwtSecret, {
    subject: user.userName,
    expiresIn: "15d",
    algorithm: "HS256",
  });
}

module.exports = (router) => {
  console.log("Router Login");
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      console.log(info);
      console.log(user);
      if (error || !user) {
        console.error("Authentication error:", error || "User not found");
        return res.status(400).json({
          message: "Something is not right",
          error: error || "User not found",
        });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};

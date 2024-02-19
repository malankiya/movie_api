const jwtSecret = "your_jwt_secret";
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport");

let generateJWTToken = (user) => {
  try {
    return jwt.sign(user, jwtSecret, {
      subject: user.userName,
      expiresIn: "7d",
      algorithm: "HS256",
    });
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw error;
  }
};

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
          console.error("Login error:", error);
          res.send(error);
        }

        try {
          let token = generateJWTToken(user.toJSON());
          return res.json({ user, token });
        } catch (tokenError) {
          console.error("Token generation error:", tokenError);
          res.status(500).send("Error generating JWT token");
        }
      });
    })(req, res);
  });
};

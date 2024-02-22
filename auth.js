const jwtSecret = process.env.secretKey;
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport");

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.userName,
    expiresIn: "30d",
    algorithm: "HS256",
  });
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
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};

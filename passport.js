require("dotenv").config();
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;
// const jwtSecret = process.env.secretKey;

passport.use(
  new LocalStrategy(
    {
      usernameField: "userName",
      passwordField: "password",
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      try {
        const user = await Users.findOne({ userName: username });

        if (!user) {
          console.log("incorrect userName");
          return callback(null, false, {
            message: "Incorrect userName or password.",
          });
        }

        if (!user.validatePassword(password)) {
          console.log("incorrect password");
          return callback(null, false, { message: "Incorrect password." });
        }

        console.log("finished");
        return callback(null, user);
      } catch (error) {
        console.error(error);
        return callback(error);
      }
    }
  )
);
// //Authenticate users based on JWT submitted with their request.
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //JWT is extracted from HTTP request header
      secretOrKey: process.env.SECRET_KEY, //use secret key to verify signature of the JWT (ensure client is who it says it is and JWT hasn't been altered)
    },

    async (jwtPayload, callback) => {
      //       //take the object literal of the decoded JWT payload as a parameter
      return await Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);

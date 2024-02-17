const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Models = require("./models.js");
const passportJWT = require("passport-jwt");

const Users = Models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJWT;

passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      try {
        const user = await Users.findOne({ username: username });
        if (!user) {
          console.log("incorrect username");
          return callback(null, false, {
            message: "Incorrect username or password.",
          });
        }
        console.log("finished");
        return callback(null, user);
      } catch (error) {
        console.log(error);
        return callback(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    async (jwtPayload, callback) => {
      try {
        const user = await Users.findById(jwtPayload.id);
        return callback(null, user);
      } catch (error) {
        return callback(error);
      }
    }
  )
);

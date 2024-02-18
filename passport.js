const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Models = require("./models.js");
const Users = Models.User;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "UserName",
      passwordField: "Password",
    },
    async (userName, password, callback) => {
      console.log(`${userName} ${password}`);
      try {
        const user = await Users.findOne({ userName: userName });
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    async (jwtPayload, callback) => {
      try {
        const user = await Users.findById(jwtPayload.id); // Use jwtPayload.Id if your payload has "Id"
        return callback(null, user);
      } catch (error) {
        return callback(error);
      }
    }
  )
);

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");
const jwtSecret = process.env.secretKey;
let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  //passport-jwt.Strategy implements a JWT authentication strategy for Passport. It requires a secret key to verify the JWT and checks for the JWT in the header
  ExtractJWT = passportJWT.ExtractJwt;
//passport-jwt.ExtractJwt is a utility that extracts the JWT from incoming requests. Specifies where and how Passport should look for the JWT.

//Takes username and password from request body and use Mongoose findOne to determine if user exists
passport.use(
  new LocalStrategy(
    {
      usernameField: "userName",
      passwordField: "password",
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({ userName: username })
        .then((user) => {
          if (!user) {
            console.log("incorrect username");
            return callback(null, false, {
              //comes back false if user does not exist
              message: "Incorrect username or password.",
            });
          }
          if (!user.validatePassword(password)) {
            //if hashed password does not match the one stored in the DB
            console.log("incorrect password");
            return callback(null, false, { message: "Incorrect password." });
          }
          console.log("finished");
          return callback(null, user); //returns user if they exist
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        });
    }
  )
);

//Authenticate users based on JWT submitted with their request.
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    },
    async (jwtPayload, callback) => {
      try {
        const user = await Users.findById(jwtPayload._id);

        if (user) {
          return callback(null, user);
        } else {
          return callback(null, false, { message: "User not found." });
        }
      } catch (error) {
        console.error(error);
        return callback(error);
      }
    }
  )
);

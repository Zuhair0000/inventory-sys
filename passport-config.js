const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUsers = async (username, password, done) => {
    const user = getUserByUsername(username);
    if (user == null) {
      return done(null, false, { message: "user not found" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "password Incorrect" });
      }
    } catch (e) {
      console.log(e);
      return done(e);
    }
  };
  passport.use(
    new localStrategy({ usernameField: "username" }, authenticateUsers)
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}
module.exports = initialize;

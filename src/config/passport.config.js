import passport from "passport";
import { Strategy } from "passport-local";
import userManager from "../dao/manager_mongo/userManager.js";
import { isValidPassword, createHash } from "../utils/crypt.js";

const um = new userManager();
const initializePassport = () => {
  passport.use(
    "register",
    new Strategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        let { first_name, last_name, age } = req.body;
        if (!first_name || !last_name || !age || !email || !password) {
          return done(null, false);
        }
        let emailUsed = await um.getUser(email);
        if (emailUsed) {
          return done(null, false);
        } else {
          const user = {
            first_name,
            last_name,
            age,
            email,
            password: createHash(password),
            is_admin: false,
          };
          let addUser = await um.addUser(user);
          done(null, addUser);
        }
      }
    )
  );
};

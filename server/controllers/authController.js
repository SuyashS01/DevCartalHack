// /server/controllers/authController.js
const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const router = express.Router();

require("dotenv").config();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, { profile, accessToken });
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// OAuth Routes
router.get("/github", passport.authenticate("github", { scope: [ "user:email", "repo" ] }));

router.get("/github/callback", passport.authenticate("github", {
  failureRedirect: "/",
  session: true
}), (req, res) => {
  res.redirect("http://localhost:3000/dashboard");
});
// /server/controllers/authController.js

router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out" }); // ✅ Send JSON, not redirect
    });
  });
});


router.get("/user", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  res.json(req.user);
});

module.exports = router;

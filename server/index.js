const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const app = express(); 

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(session({ secret: "githubmatch", resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./controllers/authController");
app.use("/auth", authRoutes);

const matchRoutes = require("./controllers/matchController");
app.use("/api", matchRoutes);

const repoRoutes = require("./controllers/userController");
app.use("/api", repoRoutes);

const liveIssuesRoute = require('./controllers/liveissueController'); // adjust path if needed
app.use('/api', liveIssuesRoute);

const profileRoutes = require("./controllers/profileController");
app.use("/api", profileRoutes);


app.listen(4000, () => console.log("Server running on http://localhost:4000"));
//node index.js
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const csrf = require("csurf");
const path = require("path");

// Middleware Imports
const authRoutes = require("./routes/authRoutes.js");
const usersController = require("./controllers/userController.js");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");
const goodCatchController = require("./controllers/goodCatchController.js");

// Database Connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production
}));

// CSRF Protection
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

// Pass user data to views
app.use(passUserToView);
app.use((req, res, next) => {
  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/goodCatch", goodCatchController);  // GoodCatch routes using session for user info
app.use("/users", usersController);  // Users controller (e.g., for sign-up, etc.)

// Home Route
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/goodCatch");
  } else {
    res.render("index.ejs");
  }
});

// Test Route
app.get("/test", (req, res) => {
  res.render("test.ejs");
});

// Error Handling
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Something went wrong!");
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

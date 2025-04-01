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
const goodCatchController = require("./controllers/goodCatchController.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

// Connect to MongoDB (using your .env connection string)
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session Configuration (must come before CSRF)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // use true in production with HTTPS
  })
);

// CSRF Protection Middleware (after session)
const csrfProtection = csrf({ cookie: false });
app.use(csrfProtection);

// Make CSRF token available to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Pass session user data to views
app.use(passUserToView);

// Mount Routes
app.use("/auth", authRoutes);
app.use("/goodCatch", goodCatchController);
app.use("/users", usersController);

// Home Route
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/goodCatch/dashboard");
  } else {
    res.render("index.ejs");
  }
});

// --- OPTIONAL: Test Route for form submission ---
// (Usually, POST routes for GoodCatch are defined in goodCatchController)
app.post("/goodCatch/new", (req, res) => {
  console.log(req.body); // Log submitted form data
  res.send("Form submitted successfully!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).send("Something went wrong!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

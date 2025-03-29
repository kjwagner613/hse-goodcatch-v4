const bcrypt = require("bcryptjs");
const User = require("../models/user.js");

// Render the sign-up page
exports.renderSignUp = (req, res) => {
  res.render("auth/sign-up.ejs");
};

// Render the sign-in page
exports.renderSignIn = (req, res) => {
  res.render("auth/sign-in.ejs");
};

// Handle sign-out
exports.signOut = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

// Handle sign-up form submission
exports.handleSignIn = async (req, res) => {
  try {
    // Find the user in the database by username
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res
        .status(401)
        .send("Login failed. Invalid username or password.");
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res
        .status(401)
        .send("Login failed. Invalid username or password.");
    }

    // Set session details for the logged-in user
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id.toString(), // Ensure it's a string
    };

    // Redirect to the home page or a protected route
    res.redirect(`/users/${userInDatabase._id}/goodCatch`);
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).send("An error occurred during sign-in. Please try again.");
  }
};

exports.handleSignUp = async (req, res) => {
  try {
    // Check if username already exists
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send("Username already taken.");
    }

    // Check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match.");
    }

    // Hash the password and create the user
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    await User.create(req.body);
    res.redirect("/auth/sign-in");
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.redirect("/auth/sign-up");
  }
};

// controllers/authController.js
exports.handleSignIn = async (req, res) => {
  try {
    // Find user by username
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.status(401).send("Login failed. Invalid username or password.");
    }

    // Compare hashed password
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if (!validPassword) {
      return res.status(401).send("Login failed. Invalid username or password.");
    }

    // Set session data
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id.toString(),  // Ensure it's a string
    };

    // Redirect to the generic goodCatch route
    res.redirect(`/goodCatch`);
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).send("An error occurred during sign-in. Please try again.");
  }
};



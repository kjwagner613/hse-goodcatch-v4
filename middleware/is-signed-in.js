const isSignedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(); // Allow access if the user is signed in
  }
  res.redirect("/auth/sign-in"); // Redirect to sign-in page if not signed in
};

module.exports = isSignedIn;

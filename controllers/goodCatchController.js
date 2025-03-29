const express = require("express");
const router = express.Router();
const GoodCatch = require("../models/goodCatch");

// GET route to render the form for creating a new GoodCatch
router.get("/new", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized: Please sign in.");
  }
  res.render("goodCatches/new.ejs", {
    csrfToken: res.locals.csrfToken, // Pass the CSRF token if needed
    user: req.session.user,
  });
});

// GET route for listing GoodCatches for the current user
router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please sign in.");
    }
    const userId = req.session.user._id;
    const goodCatches = await GoodCatch.find({ creationUser: userId }).populate("creationUser");
    res.render("goodCatches/list.ejs", {
      goodCatches,
      user: req.session.user,
      currentPage: "goodCatchList",
    });
  } catch (error) {
    console.error("Error fetching GoodCatches:", error);
    res.status(500).send("Failed to fetch GoodCatches");
  }
});

// GET route for displaying details of a single GoodCatch
router.get("/:id", async (req, res) => {
  try {
    const goodCatch = await GoodCatch.findById(req.params.id).populate("creationUser");
    if (!goodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.render("goodCatches/detail.ejs", { goodCatch, user: req.session.user });
  } catch (error) {
    console.error("Error fetching GoodCatch:", error);
    res.status(500).send("Failed to fetch GoodCatch");
  }
});

// POST route for creating a new GoodCatch
router.post("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please sign in.");
    }
    // Create an event object from the form data
    const event = {
      category: req.body.category,
      description: req.body.description,
    };

    const newGoodCatch = await GoodCatch.create({
      site: req.body.site,
      department: req.body.department,
      area: req.body.area,
      creationUser: req.session.user._id,
      events: [event], // Wrap the event in an array
    });
    res.status(201).redirect("/goodCatch");
  } catch (error) {
    console.error("Error creating GoodCatch:", error);
    res.status(500).send("Failed to create GoodCatch");
  }
});

// GET route to render the edit form for a GoodCatch
router.get("/:id/edit", async (req, res) => {
  try {
    const goodCatch = await GoodCatch.findById(req.params.id);
    if (!goodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.render("goodCatches/edit.ejs", { goodCatch, user: req.session.user });
  } catch (error) {
    console.error("Error fetching GoodCatch for editing:", error);
    res.status(500).send("Failed to load GoodCatch for editing");
  }
});

// PUT route for updating a GoodCatch
router.put("/:id", async (req, res) => {
  try {
    const updatedGoodCatch = await GoodCatch.findByIdAndUpdate(
      req.params.id,
      {
        site: req.body.site,
        department: req.body.department,
        area: req.body.area,
        // Note: You might need to parse or format events similar to your POST route.
        events: req.body.events,
      },
      { new: true }
    );
    if (!updatedGoodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.redirect("/goodCatch");
  } catch (error) {
    console.error("Error updating GoodCatch:", error);
    res.status(500).send("Failed to update GoodCatch");
  }
});

// DELETE route for deleting a GoodCatch
router.delete("/:id", async (req, res) => {
  try {
    const deletedGoodCatch = await GoodCatch.findByIdAndDelete(req.params.id);
    if (!deletedGoodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.redirect("/goodCatch");
  } catch (error) {
    console.error("Error deleting GoodCatch:", error);
    res.status(500).send("Failed to delete GoodCatch");
  }
});

module.exports = router;

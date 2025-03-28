const express = require("express");
const router = express.Router();
const GoodCatch = require("../models/goodCatch");

// Fetch all GoodCatches for a specific user
router.get("/", async (req, res) => {
  try {
    // Fetch the user details based on userId
    const user = await User.findById(req.params.userId); // req.params.userId comes from the URL path
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find all GoodCatches associated with this user
    const goodCatches = await GoodCatch.find({ creationUser: user._id }).populate("creationUser");

    // Pass both the user and their GoodCatches to the view
    res.render("goodCatches/list.ejs", { goodCatches, user }); // user contains the username
  } catch (error) {
    console.error("Error fetching GoodCatches:", error);
    res.status(500).send("Failed to fetch GoodCatches");
  }
});

// Fetch a single GoodCatch by ID
router.get("/:id", async (req, res) => {
  try {
    const goodCatch = await GoodCatch.findById(req.params.id).populate("creationUser");
    if (!goodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.render("goodCatches/detail.ejs", { goodCatch }); // Adjust this view as necessary
  } catch (error) {
    console.error("Error fetching GoodCatch:", error);
    res.status(500).send("Failed to fetch GoodCatch");
  }
});

// Create a new GoodCatch
router.post("/", async (req, res) => {
  try {
    const newGoodCatch = await GoodCatch.create({
      site: req.body.site,
      department: req.body.department,
      area: req.body.area,
      creationUser: req.params.userId, // Use userId from the URL
      events: req.body.events,
    });
    res.status(201).redirect(`/users/${req.params.userId}/goodCatch`);
  } catch (error) {
    console.error("Error creating GoodCatch:", error);
    res.status(500).send("Failed to create GoodCatch");
  }
});

router.get("/:userId/goodCatch", async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from the URL
    const goodCatches = await GoodCatch.find({ creationUser: userId }).populate("creationUser");
    res.render("goodCatches/list.ejs", { goodCatches, userId }); // Pass userId to the view
  } catch (error) {
    console.error("Error fetching GoodCatches:", error);
    res.status(500).send("Failed to fetch GoodCatches");
  }
});

// Edit a GoodCatch
router.get("/:id/edit", async (req, res) => {
  try {
    const goodCatch = await GoodCatch.findById(req.params.id);
    if (!goodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.render("goodCatches/edit.ejs", { goodCatch });
  } catch (error) {
    console.error("Error fetching GoodCatch for editing:", error);
    res.status(500).send("Failed to load GoodCatch for editing");
  }
});

// Update a GoodCatch
router.put("/:id", async (req, res) => {
  try {
    const updatedGoodCatch = await GoodCatch.findByIdAndUpdate(
      req.params.id,
      {
        site: req.body.site,
        department: req.body.department,
        area: req.body.area,
        events: req.body.events,
      },
      { new: true }
    );
    if (!updatedGoodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.redirect(`/users/${req.params.userId}/goodCatch`);
  } catch (error) {
    console.error("Error updating GoodCatch:", error);
    res.status(500).send("Failed to update GoodCatch");
  }
});

// Delete a GoodCatch
router.delete("/:id", async (req, res) => {
  try {
    const deletedGoodCatch = await GoodCatch.findByIdAndDelete(req.params.id);
    if (!deletedGoodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.redirect(`/users/${req.params.userId}/goodCatch`);
  } catch (error) {
    console.error("Error deleting GoodCatch:", error);
    res.status(500).send("Failed to delete GoodCatch");
  }
});

module.exports = router;
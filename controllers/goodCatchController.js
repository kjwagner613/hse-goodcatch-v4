const express = require("express");
const router = express.Router();
const GoodCatch = require("../models/goodCatch");

router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please sign in.");
    }
    const sessionUserId = req.session.user._id;

    const goodCatches = await GoodCatch.find({
      creationUser: sessionUserId,
    }).populate("creationUser");
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

router.get("/:id", async (req, res) => {
  try {
    const goodCatch = await GoodCatch.findById(req.params.id).populate(
      "creationUser"
    );
    if (!goodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.render("goodCatches/detail.ejs", { goodCatch });
  } catch (error) {
    console.error("Error fetching GoodCatch:", error);
    res.status(500).send("Failed to fetch GoodCatch");
  }
});

router.post("/", async (req, res) => {
  try {
    const newGoodCatch = await GoodCatch.create({
      site: req.body.site,
      department: req.body.department,
      area: req.body.area,
      creationUser: req.params.userId,
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
    // Check if user is authenticated
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please sign in.");
    }

    const sessionUserId = req.session.user._id;
    const urlUserId = req.params.userId;

    // Ensure the user is accessing their own data
    if (sessionUserId !== urlUserId) {
      return res
        .status(403)
        .send("Forbidden: You can't access other users' data.");
    }

    // Find GoodCatch records for the authenticated user
    const goodCatches = await GoodCatch.find({
      creationUser: sessionUserId,
    }).populate("creationUser");

    if (!goodCatches.length) {
      return res.status(404).send("No GoodCatches found for this user.");
    }

    // Render the results using EJS
    res.render("goodCatches/list.ejs", { goodCatches, user: req.session.user });
  } catch (error) {
    console.error("Error fetching GoodCatches:", error);
    res.status(500).send("Failed to fetch GoodCatches.");
  }
});

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

const express = require("express");
const router = express.Router();
const GoodCatch = require("../models/goodCatch");

// ============================
// Static Routes First
// ============================

// GET: Render the form for creating a new GoodCatch
router.get("/new", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized: Please sign in.");
  }
  res.render("goodCatches/new.ejs", {
    csrfToken: res.locals.csrfToken,
    user: req.session.user,
  });
});

// GET: Dashboard - list records grouped by category
router.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please sign in.");
    }
    const userId = req.session.user._id;
    const goodCatches = await GoodCatch.find({ creationUser: userId }).populate("creationUser");

    // Group records by category (using first event's category)
    const groupedByCategory = {};
    goodCatches.forEach(item => {
      const category = (item.events && item.events[0] && item.events[0].category) || "Uncategorized";
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = [];
      }
      groupedByCategory[category].push(item);
    });

    res.render("goodCatches/dashboard.ejs", {
      goodCatches,
      groupedByCategory,
      user: req.session.user,
      currentPage: "dashboard",
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).send("Failed to load dashboard");
  }
});

// GET: Render list view for editing records (edit list)
router.get("/editlist", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please sign in.");
    }
    const userId = req.session.user._id;
    const goodCatches = await GoodCatch.find({ creationUser: userId });
    res.render("goodCatches/editlist.ejs", {
      goodCatches,
      user: req.session.user,
      csrfToken: res.locals.csrfToken,
    });
  } catch (error) {
    console.error("Error fetching records for editing:", error);
    res.status(500).send("Failed to load records for editing.");
  }
});

// GET: Render list view for deleting records (delete list)
router.get("/deletelist", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please sign in.");
    }
    const userId = req.session.user._id;
    const goodCatches = await GoodCatch.find({ creationUser: userId });
    res.render("goodCatches/deletelist.ejs", {
      goodCatches,
      user: req.session.user,
      csrfToken: res.locals.csrfToken,
    });
  } catch (error) {
    console.error("Error fetching records for deletion:", error);
    res.status(500).send("Failed to load records for deletion.");
  }
});

// GET: List GoodCatch records (simple list view)
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
      currentPage: "list",
    });
  } catch (error) {
    console.error("Error fetching GoodCatches:", error);
    res.status(500).send("Failed to fetch GoodCatches");
  }
});

// POST: Create a new GoodCatch
router.post("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please sign in.");
    }
    const event = {
      category: req.body.category,
      description: req.body.description,
    };
    const newGoodCatch = await GoodCatch.create({
      site: req.body.site,
      department: req.body.department,
      area: req.body.area,
      creationUser: req.session.user._id,
      events: [event],
    });
    res.status(201).redirect("/goodCatch/dashboard");
  } catch (error) {
    console.error("Error creating GoodCatch:", error);
    res.status(500).send("Failed to create GoodCatch");
  }
});

// GET: Render the edit form for a GoodCatch
router.get("/:id/edit", async (req, res) => {
  try {
    const goodCatch = await GoodCatch.findById(req.params.id);
    if (!goodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.render("goodCatches/edit.ejs", {
      goodCatch,
      user: req.session.user,
      csrfToken: res.locals.csrfToken,
    });
  } catch (error) {
    console.error("Error fetching GoodCatch for editing:", error);
    res.status(500).send("Failed to load GoodCatch for editing");
  }
});

// PUT: Update a GoodCatch
router.put("/:id", async (req, res) => {
  try {
    const updatedGoodCatch = await GoodCatch.findByIdAndUpdate(
      req.params.id,
      {
        site: req.body.site,
        department: req.body.department,
        area: req.body.area,
        events: req.body.events || [],
      },
      { new: true }
    );
    if (!updatedGoodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.redirect("/goodCatch/dashboard");
  } catch (error) {
    console.error("Error updating GoodCatch:", error);
    res.status(500).send("Failed to update GoodCatch");
  }
});

// DELETE: Remove a GoodCatch
router.delete("/:id", async (req, res) => {
  try {
    const deletedGoodCatch = await GoodCatch.findByIdAndDelete(req.params.id);
    if (!deletedGoodCatch) {
      return res.status(404).send("GoodCatch not found");
    }
    res.redirect("/goodCatch/dashboard");
  } catch (error) {
    console.error("Error deleting GoodCatch:", error);
    res.status(500).send("Failed to delete GoodCatch");
  }
});

module.exports = router;

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
    const goodCatches = await GoodCatch.find({ creationUser: userId }).populate(
      "creationUser"
    );

    // Group records by category (using first event's category)
    const groupedByCategory = {};
    goodCatches.forEach((item) => {
      const category =
        (item.events && item.events[0] && item.events[0].category) ||
        "Uncategorized";
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

router.get("/search", async (req, res) => {
  try {
    const { site, department, category, area } = req.query;
    const userId = req.session.user._id;

    // Construct a query object dynamically
    let searchCriteria = { creationUser: userId };
    if (site) searchCriteria.site = new RegExp(site, "i");
    if (department) searchCriteria.department = new RegExp(department, "i");
    if (category) searchCriteria["events.category"] = new RegExp(category, "i");
    if (area) searchCriteria.area = new RegExp(area, "i");

    const goodCatches = await GoodCatch.find(searchCriteria).populate(
      "creationUser"
    );

    res.render("goodCatches/list", {
      goodCatches,
      user: req.session.user,
      searchTerm: req.query,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).send("Search failed");
  }
});

router.get("/search-form", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/sign-in");
  }
  res.render("goodCatches/search-form", {
    user: req.session.user,
    csrfToken: res.locals.csrfToken,
  });
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

// GET: List GoodCatch records (simple list view)
router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("Unauthorized: Please sign in.");
    }
    const userId = req.session.user._id;
    const goodCatches = await GoodCatch.find({ creationUser: userId }).populate(
      "creationUser"
    );
    res.render("goodCatches/list.ejs", {
      goodCatches,
      user: req.session.user,
      currentPage: "list",
      searchTerm: {},
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
    const goodCatch = await GoodCatch.findById(req.params.id);
    if (!goodCatch) {
      return res.status(404).send("GoodCatch not found");
    }

    // Update top-level fields
    goodCatch.site = req.body.site;
    goodCatch.department = req.body.department;
    goodCatch.area = req.body.area;

    // Update the first event's category and description (if present)
    if (goodCatch.events.length > 0) {
      goodCatch.events[0].category =
        req.body.category || goodCatch.events[0].category;
      goodCatch.events[0].description =
        req.body.description || goodCatch.events[0].description;
    }

    await goodCatch.save();
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
      return res.status(404).json({ message: "GoodCatch not found" });
    }
    res.status(200).json({ message: "Deleted successfully" }); // ✅ JSON format
  } catch (error) {
    console.error("Error deleting GoodCatch:", error);
    res.status(500).json({ message: "Failed to delete GoodCatch" }); // ✅ JSON format
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const goodCatchController = require("../controllers/goodCatchController");
const createGoodCatch = require("../controllers/createGoodCatchController");

router.post("/", goodCatchController.createGoodCatch);
router.get("/", goodCatchController.getGoodCatches);
router.get("/:id", goodCatchController.getGoodCatchById);

module.exports = router;
const express = require("express");
const router = express.Router();
const goodCatchController = require("../controllers/goodCatchController");

router.post("/", goodCatchController.createGoodCatch);
router.get("/", goodCatchController.getGoodCatches);
router.get("/:id", goodCatchController.getGoodCatchById);

module.exports = router;
const express = require("express");
const router = express.Router();
const upload = require("../middleware/filehandler");
const { protect } = require("../middleware/auth");

const {
  getBug,
  getBugs,
  createbug,
  updateBug,
  deleteBug,
} = require("../controllers/bugController");

router
  .route("/")
  .get(getBugs)
  .post(protect, upload.single("attachments"), createbug);
// router.route("/").get(getBugs).post(createbug);
router.route("/:id").get(getBug).put(updateBug).delete(deleteBug);

module.exports = router;

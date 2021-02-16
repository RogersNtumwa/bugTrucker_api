const multer = require("multer");
const appError = require("../utils/appError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    // fileSize: 1024 * 1024 * 5,
    fileSize: 2000000,
  },

  fileFilter: function (req, file, cb) {
    if (
      file.originalname.endsWith(".png") ||
      file.originalname.endsWith(".jpg")
    ) {
      cb(null, true);
    } else {
      console.log("Only jpg, jpeg & png files are supported");
      cb(null, false);
    }
  },
});

module.exports = upload;

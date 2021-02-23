const express = require("express");
const router = express.Router();
const multer = require("multer");
const { status400 } = require("../error/index");

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  }),
  limits: {
    fileSize: 2097152, // 限制文件大小2M
    files: 2, // 限制文件数量
  },
});

function uploadMiddleware(req, res, next) {
  upload.array("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.json({
        code: 400,
        status: false,
        message: err.message,
      });
      next(status400);
      return;
    } else {
      next();
    }
  });
}

// 文件上传
router.post("/", uploadMiddleware, (req, res) => {
  res.json({
    code: 200,
    status: true,
    message: "success",
  });
});

module.exports = router;

const path = require("path");
const express = require("express");
const bodyParser = require('body-parser')
const user = require('./routes/user')
const multerUpload = require("./routes/upload");
const { status404, status500 } = require("./error/index");

const app = express();
const port = 3000;

// 托管静态文件,将public目录下的资源对外开发
// http://localhost:3000/images/1613982184754-4a731a90594a4af544c0c25941171.jpeg
app.use(express.static(path.join(__dirname, "public")));

// 解析application/json
app.use(bodyParser.json())

// 用户模块
app.use("/api/user", user)

// 文件上传
app.use("/api/upload", multerUpload);

// 404错误处理
app.use(function (req, res, next) {
  res.status(404).json({
    code: 404,
    status: false,
    ...status404
  });
  next(status404);
});

// 错误处理
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    status: false,
    ...status500
  });
});

app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);

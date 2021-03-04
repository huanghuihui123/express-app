const express = require("express");
const router = express.Router();
const request = require("request");
const jwt = require("jsonwebtoken");
const db = require("../db"); //引入数据库封装模块

// 查询users表
function queryUserList(next, callBack) {
  db.query(
    "SELECT * FROM users;",
    [],
    function (results, fields) {
      let res = JSON.parse(JSON.stringify(results));
      callBack(res);
    },
    next
  );
}

// 查询用户列表
router.get("/getUserList", function (req, res, next) {
  queryUserList(next, function (userList) {
    res.json({
      code: 200,
      data: userList,
      status: true,
      message: "success",
    });
  });
});

// 注册用户
router.post("/register", function (req, res, next) {
  const { account, password } = req.body;
  queryUserList(next, function (userList) {
    let isRegister =
      userList.length && userList.some((item) => item.account === account);
    if (isRegister) {
      res.json({
        code: 400,
        status: false,
        message: "该账号已注册！",
      });
      return;
    }
    db.query(
      `INSERT INTO users (account, password, create_time) VALUES(${account}, ${password}, NOW());`,
      [],
      function (results, fields) {
        if (results.affectedRows) {
          res.json({
            code: 200,
            status: true,
            message: "success",
          });
        }
      },
      next
    );
  });
});

// 登录
router.post("/login", function (req, res, next) {
  const { account, password, appid, secret, code } = req.body;
  // request(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`, function (error, response, body) {
  //   console.error("error:", error); // Print the error if one occurred
  //   console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
  //   console.log("body:", body); // Print the HTML for the Google homepage.
  // });
  const secretOrPrivateKey = "myapp";
  const token = jwt.sign({ account, password }, secretOrPrivateKey, {
    expiresIn: 60 * 60,
  });
  queryUserList(next, function (userList) {
    if (!userList.length) {
      res.json({
        code: 400,
        status: false,
        message: "该账号不存在！",
      });
      // next();
      return;
    }

    let user = userList.find((item) => item.account === account);
    if (!user) {
      res.json({
        code: 400,
        status: false,
        message: "该账号不存在！",
      });
    } else {
      if (user.password === password) {
        res.json({
          code: 200,
          data: {
            token,
          },
          status: true,
          message: "登录成功！",
        });
        db.query(
          `UPDATE users SET token = '${token}' WHERE ACCOUNT = ${account} AND PASSWORD = ${password};`,
          [],
          function (results, fields) {
            if (results.affectedRows) {
              console.log("token存储成功！");
            }
          },
          next
        );
      } else {
        res.json({
          code: 400,
          status: false,
          message: "密码错误",
        });
      }
    }
  });
});

module.exports = router;

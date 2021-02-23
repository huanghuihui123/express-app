const express = require("express");
const router = express.Router();
const db = require("../db"); //引入数据库封装模块

// 查询users表
function queryUserList(next, callBack) {
  db.query(
    "SELECT * FROM USERS",
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
      userList.length &&
      userList.some(
        (item) => item.account === account && item.password === password
      );
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

router.post("/login", function (req, res, next) {
  console.log(req);
  const { account, password } = req.body;
  queryUserList(next, function (userList) {
    if (!userList.length) {
      res.json({
        code: 400,
        status: false,
        message: "该账号不存在！",
      });
      return;
    }
    userList.forEach((item) => {
      if (item.account === account) {
        if (item.password === password) {
          res.json({
            code: 200,
            status: true,
            message: "登录成功！",
          });
        } else {
          res.json({
            code: 400,
            status: false,
            message: "密码错误",
          });
        }
      } else {
        res.json({
          code: 400,
          status: false,
          message: "该账号不存在！",
        });
      }
    });
  });
});

module.exports = router;

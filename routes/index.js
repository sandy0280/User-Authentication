var express = require("express");
var router = express.Router();
var userModule = require("../module/user");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}
// Matching form-email with database email
function checkEmail(req, res, next) {
  var email = req.body.email;
  var checkExistEmail = userModule.findOne({ email: email });
  checkExistEmail.exec((err, data) => {
    if (err) throw err;
    if (data) {
      return res.render("signup", {
        title: "Express",
        msg: "Email already exist",
      });
    }
    next();
  });
}

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express ", msg: "Welcome to Login" });
});
// when user submit the Login-form it will redirect here...
router.post("/", function (req, res, next) {
  //Collecting form-data
  var username = req.body.username;
  var password = req.body.password;

  var checkUser = userModule.findOne({ username: username });
  checkUser.exec((err, data) => {
    if (err) throw err;

    var getUserId = data._id;
    var getPassword = data.password;

    //Generating a Token after matching password with the db password
    if (bcrypt.compareSync(password, getPassword)) {
      var token = jwt.sign({ userID: getUserId }, "loginToken");

      localStorage.setItem("userToken", token);

      localStorage.setItem("loginUser", username);
      res.render("index", { title: "Express", msg: " loged-In successfully" });
    } else {
      res.render("index", {
        title: "Express",
        msg: " Invalid Username & passwors",
      });
    }
  });
});

router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "Express", msg: "Welcome to Login" });
});

// when user submit the signup-form it will redirect here...
router.post("/signup", checkEmail, function (req, res, next) {
  //what user entered in the form is collected here..
  var username = req.body.username;
  var mobileno = req.body.mobileno;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  var male = req.body.gender;
  var female = req.body.gender;

  // Matching password with the confirm password
  if (password != cpassword) {
    res.render("signup", { title: "Express", msg: "password not Matched" });
  } else {
    // After matching the password it will be bycrpted using hsahSync method
    password = bcrypt.hashSync(password, 10);

    // Transfering collected form data into database
    var userDetails = new userModule({
      username: username,
      mobileno: mobileno,
      email: email,
      password: password,
      gender: male,
      gender: female,
    });
    userDetails.save((err, doc) => {
      if (err) throw err;
      res.render("signup", {
        title: "Express",
        msg: "User Registration Successful",
      });
    });
  }
});

module.exports = router;

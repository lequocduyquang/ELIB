const express = require("express");
const User = require("./../models/User");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allBooks = await Book.listbook();
    const sortBooks = await Book.sortbook();
    return res.render("home", {
      books: allBooks,
      sortbooks: sortBooks
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/singlebook/:id", async (req, res) => {
  try {
    const foundBook = await Book.singlebyID(req.params.id);
    console.log(foundBook);
    return res.render("book", {
      foundBook: foundBook
    });
  } catch (error) {
    console.log(err);
  }
});

router.get("/borrowbook/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    const foundBook = await Book.singlebyID(bookId);
    await cart.add(foundBook, foundBook.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/borrow", function(req, res, next) {
  if (!req.session.cart) {
    return res.render("borrow", { books: null });
  }
  var cart = new Cart(req.session.cart);
  res.render("borrow", {
    books: cart.generateArray()
    // totalPrice: cart.totalPrice
  });
});

router.get('/reduce/:id', function(req, res, next) {
    const bookId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(bookId);
    req.session.cart = cart;
    res.redirect('/borrow');
});

router.get('/remove/:id', function(req, res, next) {
    const bookId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(bookId);
    req.session.cart = cart;
    res.redirect('/borrow');
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/faq", (req, res) => {
  res.render("faq");
});

router.get("/privacy", (req, res) => {
  res.render("privacy");
});

router.get("/terms", (req, res) => {
  res.render("terms");
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

// Register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

module.exports = router;

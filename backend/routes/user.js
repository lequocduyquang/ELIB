const express = require("express");
const User = require("./../models/User");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const Card = require("../models/Card");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const escapeRegex = require("../helpers/regex-escape");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let noMatch = null;
    if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi')
      Book.find({
        title: regex
      }, (err, allBooks) => {
        if(err) {
          console.log(err)
        } else {
          if(allBooks.length < 1) {
            noMatch = 'No posts match that query'
          }
          res.render('search', {
            books: allBooks,
            noMatch: noMatch
          })
        }
      })
    } 
    
    else {

      const allBooks = await Book.find({});
      const sortBooks = await Book.find({});
      return res.render("home", {
        books: allBooks,
        sortbooks: sortBooks
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/singlebook/:id", async (req, res) => {
  try {
    // const foundBook = await Book.singlebyID(req.params.id);
    const foundBook = await Book.findById(req.params.id);
    return res.render("book", {
      foundBook: foundBook
    });
  } catch (error) {
    console.log(err);
  }
});

router.get("/borrowbook/:id", (req, res, next) => {
  const bookId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  Book.findById(bookId, (err, book) => {
    if(err) {
      return res.redirect('/');
    }

    cart.add(book, book.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
});

router.get("/borrow", function (req, res, next) {
  if (!req.session.cart) {
    return res.render("borrow", { books: null });
  }
  console.log("Borrow: ", req.session.cart);
  var cart = new Cart(req.session.cart);
  res.render("borrow", {
    books: cart.generateArray()
  });
});

router.get('/reduce/:id', function (req, res, next) {
  const bookId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(bookId);
  req.session.cart = cart;
  res.redirect('/borrow');
});

router.get('/remove/:id', function (req, res, next) {
  const bookId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(bookId);
  req.session.cart = cart;
  res.redirect('/borrow');
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/borrow');
  }
  var cart = new Cart(req.session.cart);
  console.log(cart.items)
  res.render('checkout', {
    cart
  });
});

router.post('/checkout', function (req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/borrow');
  }
  var cart = new Cart(req.session.cart);
  var card = new Card({
    // startDay,
    // endDay,
    user: req.user,
    books: cart.generateArray()
  })
  // console.log(card)
  card.save((err, result) => {
    if (err) console.log(err)
    console.log(result)
    req.session.cart = null
    res.redirect('/')
  })
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

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/profile", (req, res, next) => {
  res.render("profile");
});

router.get("/register", (req, res) => {
  res.render("register");
});

// Register
router.post("/register", (req, res) => {
  const { name, email, phone, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !phone || !password || !password2) {
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
      phone,
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
          phone,
          password,
          permission: 0
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
  // passport.authenticate("local", {
  //   successRedirect: "/",
  //   failureRedirect: "/login",
  //   failureFlash: true
  // })(req, res, next);

  passport.authenticate('local', (err, user, info) => { // sd passport local
    if (err)
      return next(err);

    if (!user) {
      return res.render("login");
    }

    req.logIn(user, err => {
      if (err)
        return next(err);
      else {
        if (user.permission == 0)
          return res.redirect('/'); // login thành công với user
        else if (user.permission == 1)
          return res.redirect('/admin'); // login thành công với admin
      }

    });
  })(req, res, next);
});

// logout
router.post('/logout', (req, res) => {
  if (req.user) {
    req.logOut();
    res.redirect('/login');
  }
})
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}
const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const peopleModel = require('../models/people');


const csrf = require("csurf");

const csrfProtection = csrf();
router.use(csrfProtection);

/* GET Profile page. User */
router.get('/profile', isLoggedIn, (req, res, next) => {
  peopleModel.find().find((err, data) => {
    res.render('profile', {
      User: data
    })
  });
});

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/')

})

router.use('/', notLoggedIn, (req, res, next) => {
  next();
})
// Login && Logout && register
router.get('/register', (req, res, next) => {
  var messages = req.flash('error');
  res.render('register', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/register/create', passport.authenticate('local.signup', {
  successRedirect: '/',
  failureRedirect: '/register',
  failureFlash: true
}));

router.get('/login', (req, res, next) => {
  var messages = req.flash('error');
  res.render('Login', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/login/user', passport.authenticate('local.signin', {
  successRedirect: '/profile',
  failureRedirect: '/register',
  failureFlash: true
}));





module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
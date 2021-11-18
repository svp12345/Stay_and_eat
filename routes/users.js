const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../model/User');

// Login
router.get('/login', (req, res) => res.render('login'));

// Register
router.get('/register', (req, res) => res.render('register'));

// handle register
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields;
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all the details' });
    }

    // Check passwords match
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be atleast 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else {
        // Validation passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Email already exists.' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) { throw err };
                            newUser.password = hash;
                            // save the user;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in.')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }
            })

    }
})

router.post('/insert', (req, res) => {
    console.log(req.body);
})

// Login handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//Logout handle

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/users/login');
})

module.exports = router;
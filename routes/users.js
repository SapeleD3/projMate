const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//load User model
require('../models/User');
const User = mongoose.model('User')

//User LoginRoute
router.get('/login', (req, res) => {
    res.render('users/login')
})

//User RegisterRoute
router.get('/register', (req, res) => {
    res.render('users/register')
})

//Login Form Post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect:'/Proj',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//Register form post
router.post('/register', (req,res) => {
    let errors = []
    
    if(req.body.password != req.body.password2){
        errors.push({text: 'passwords do not match'})
    }
    if(req.body.password.length < 4){
        errors.push({text: 'password must be atleast 4 character'})
    }
    if(errors.length > 0){
        res.render('users/register', {
            errors,
            name: req.body.name,
            email: req.body.email
        });
    } else {
        User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                req.flash('error_msg', 'User is already Registered')
                res.redirect('/users/login')
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
        
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'you are Registered and can Login');
                            res.redirect('/users/login')
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    })
                });
            }
        })
    }
})

//logout User
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'you are Logged out')
    res.redirect('/users/login');
})
module.exports = router
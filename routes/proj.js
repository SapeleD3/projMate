const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const {ensureAuthenticated} = require('../helpers/auth')

//Load Proj Module
require('../models/Proj');
const Proj = mongoose.model('Proj')

//proj index page
router.get('/', ensureAuthenticated, (req, res) => {
    Proj.find({user: req.user.id})
    .sort({date:'desc'})
    .then(projs => {
        res.render('proj/index', {
            proje: projs
        })
    })
    
})

//add Proj form
router.get('/add', ensureAuthenticated, (req,res) => res.render('proj/add'))

//Edit Proj form
router.get('/edit/:id', (req,res) => {
    Proj.findOne({
        _id: req.params.id
    })
    .then(projs => {
        if(proj.user != req.user.id){
            req.flash('error_msg', 'not authorized');
            res.redirect('/proj')
        } else {
            res.render('proj/edit', {
                proj3: projs
            })
        }
    })
    
})

//process form
router.post('/', ensureAuthenticated, (req, res)=> {
    let errors = []

    if(!req.body.title){
        errors.push({title: 'please insert titles'})
    }
    if(!req.body.details){
        errors.push({details: 'please put in some details'})
    }
    if(errors.length > 0) {
        res.render('/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        })

    } else {
        const newProj = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Proj(newProj)
            .save()
            .then(proj => {
                req.flash('success_msg', 'Project Added Successfully')
                res.redirect('/proj')
            })
    }
})

//edit process form
router.put('/:id', ensureAuthenticated, (req, res) => {
    Proj.findOne({
        _id:req.params.id
    })
    .then(proj => {
        //new Values
        proj.title = req.body.title;
        proj.details = req.body.details;

        proj.save()
        .then(proj => {
            req.flash('success_msg', 'Project Updated Successfully')
            res.redirect('/proj')
        })
    })
})

//delete proj
router.delete('/:id', ensureAuthenticated, (req, res) => {
    //delete fromdb
    Proj.deleteOne({
        _id: req.params.id
    })
    .then(() => {
        req.flash('success_msg', 'video idea removed')
        res.redirect('/proj')
    })
});
module.exports = router
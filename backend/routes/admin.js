const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var bookModel = require('../models/Book');

router.get('/', (req, res) => {
    res.render('layouts/admin/admin', {
        layout: false,
        profile: true,
        title: 'User Profile',
        isActiveProfile: true
    })
});

router.get('/addnewbook', (req, res) => {
    res.render('layouts/admin/admin', {
        layout: false,
        addnewbook: true,
        title: 'Add new book',
        isActiveAdd: true
    })
});

router.post('/addnewbook', (req, res) => {
    var entity = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        image: req.body.image,
        category: req.body.type,
        description: req.body.description,
        status: true
    }
    bookModel.add(entity)
        .then(rows => {
            res.redirect('/admin/listbook');
        })
        .catch(err => {
            res.json(err + '');
        })

});


router.get('/profile', (req, res, next) => {
    res.render('layouts/admin/admin', {
        layout: false,
        profile: true,
        title: 'User Profile',
        isActiveProfile: true
    })
})

router.get('/listbook', (req, res, next) => {
    bookModel.listbook()
        .then(docs => {
            res.render('layouts/admin/admin', {
                layout: false,
                listbook: true,
                title: 'Table',
                isActiveList: true,
                list:docs
            })
        })
        .catch(err => {
            res.json(err + '');
        })

})

router.get('/:id',(req,res,next)=>{
    
})

module.exports = router;
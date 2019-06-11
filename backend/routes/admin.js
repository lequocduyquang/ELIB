const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var bookModel = require('../models/Book');
var id_temp = null;

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
        viewTitle: 'Add new book',
        layout: false,
        addnewbook: true,
        isActiveAdd: true,
        action: '/admin/addnewbook'
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
                list: docs
            })
        })
        .catch(err => {
            res.json(err + '');
        })

})

router.get('/:id', (req, res, next) => {
    id_temp = req.params.id;
    bookModel.singlebyID(id_temp)
        .then(docs => {
            res.render('layouts/admin/admin', {
                viewTitle: 'Edit book',
                layout: false,
                addnewbook: true,
                isActiveAdd: true,
                list: docs,
                action: '/admin/editbook'
            })
        })
        .catch(err => {
            res.json(err + '');
        })
})

router.post('/editbook', (req, res, next) => {
    var entity = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        image: req.body.image,
        category: req.body.type,
        description: req.body.description,
        status: true
    }
    bookModel.editbook(entity, id_temp)
        .then(docs => {
            res.redirect('/admin/listbook');
        })
        .catch(err => {
            res.json(err + '');
        })
})

router.get('/delete/:id', (req, res, next) => {
    bookModel.deletebook(req.params.id)
        .then(docs => {
            res.redirect('/admin/listbook');
        })
        .catch(err => {
            res.json(err + '');
        })
})

module.exports = router;
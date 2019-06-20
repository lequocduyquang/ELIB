const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var bookModel = require('../models/Book');
var userModel = require('../models/User');

var categoryModel = require('../models/Category');
var multer = require('multer');
var id_temp = null;
var id_temp_category=null;

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('layouts/admin/admin', {
        layout: false,
        profile: true,
        title: 'User Profile',
        isActiveProfile: true
    })
});

router.get('/addnewbook', (req, res) => {
    var Listcategory;
    categoryModel.listcategory()
        .then(rows => {
            Listcategory = rows;
            bookModel
                .listbook()
            res.render('layouts/admin/admin', {
                viewTitle: 'Add new book',
                layout: false,
                addnewbook: true,
                isActiveAdd: true,
                _listcategory: Listcategory,
                action: '/admin/addnewbook',
            })
        })
});

router.get('/addnewcategory', (req, res) => {
    res.render('layouts/admin/admin', {
        viewTitle: 'Add new category',
        layout: false,
        addnewcategory: true,
        isActiveCategory: true,
        action: '/admin/addnewcategory'
    })
})

router.post('/addnewbook', upload.single('image'), (req, res) => {
    var path = req.file.path;
    path = path.slice(7, path.length);

    var entity = {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        image: path,
        category: req.body.category,
        description: req.body.description,
        status: true
    }
    console.log('entity: ' + entity);

    bookModel.add(entity)
        .then(rows => {
            console.log('rows: ' + rows)
            res.redirect('/admin/listbook');
        })
        .catch(err => {
            res.json(err + '');
        })

});

router.post('/addnewcategory', (req, res) => {
    var entity = {
        name: req.body.name
    }
    categoryModel.add(entity)
        .then(rows => {
            res.redirect('/admin/listcategory')
        })
        .catch(err => {
            res.json(err + '')
        })
})

router.get('/listcategory', (req, res, next) => {
    categoryModel.listcategory()
        .then(docs => {
            res.render('layouts/admin/admin', {
                layout: false,
                title: 'List Category',
                listcategory: true,
                isActiveListCategory: true,
                list: docs
            })
        })
        .catch(err => {
            res.json(err + '');
        })

})

router.get('/listcategory/:id', (req, res, next) => {
    id_temp_category=req.params.id
    categoryModel.singlebyID(id_temp_category)
        .then(docs => {
            res.render('layouts/admin/admin', {
                viewTitle: 'Edit category',
                layout: false,
                addnewcategory: true,
                isActiveCategory: true,
                list: docs,
                action: '/admin/editcategory'
            })
        })
        .catch(err => {
            res.json(err + '');
        })
})

router.get('/listcategory/delete/:id', (req, res, next) => {
    categoryModel.deletecategory(req.params.id)
    .then(rows=>{
        res.redirect('/admin/listcategory');
    })
    .catch(err=>{
        res.json(err+'');
    })
})

router.post('/editcategory', (req, res) => {
    var entity={
        name:req.body.name
    }

    categoryModel.editcategory(entity,id_temp_category)
    .then(rows=>{
        res.redirect('/admin/listcategory');
    })
    .catch(err=>{
        res.json(err+'');
    })
})

router.get('/profile', (req, res, next) => {
    res.render('layouts/admin/admin', {
        layout: false,
        profile: true,
        title: 'User Profile',
        isActiveProfile: true
    })
})

router.get('/listuser', (req, res) => {
    userModel.find((err, docs) => {
        if (err)
            res.json(err + '');
        else {
            res.render('layouts/admin/admin',
                {
                    layout: false,
                    listuser: true,
                    title: 'List User',
                    isActiveListUser: true,
                    list: docs
                })

        }
    })

})

router.get('/listbook', (req, res, next) => {
    bookModel.listbook()
        .then(docs => {
            res.render('layouts/admin/admin',
                {
                    layout: false,
                    listbook: true,
                    title: 'List Book',
                    isActiveList: true,
                    list: docs
                })
        })
        .catch(err => {
            res.json(err)
        })
})

router.get('/listbook/:id', (req, res, next) => {
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

router.get('/listuser/delete/:id', (req, res, next) => {
    userModel.findByIdAndRemove(req.params.id).exec((err, docs) => {
        if (err) res.json(err + '');
        else {
            res.redirect('/admin/listuser');
        }
    })
})


module.exports = router;
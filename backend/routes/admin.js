const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('layouts/admin/admin', {
        layout: false,
        profile: true,
        title: 'User Profile',
        isActiveProfile:true
    })
});

router.get('/addnewbook', (req, res) => {
    res.render('layouts/admin/admin', {
        layout: false,
        addnewbook: true,
        title: 'Add new book',
        isActiveAdd:true
    })
});

router.get('/profile', (req, res, next) => {
    res.render('layouts/admin/admin', {
        layout: false,
        profile: true,
        title: 'User Profile',
        isActiveProfile:true
    })
})

router.get('/listbook',(req,res,next)=>{
    res.render('layouts/admin/admin',{
        layout:false,
        listbook:true,
        title: 'Table',
        isActiveList:true
    })
})

module.exports = router;
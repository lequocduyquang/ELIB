const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('layouts/admin/admin', {
        layout: false,
    })
});

router.get('/addnewbook', (req, res) => {
    res.render('layouts/admin/admin', {
        layout: false,
        addnewbook:true
    })
});

module.exports = router;
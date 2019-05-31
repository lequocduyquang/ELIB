const express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('layouts/admin/admin', {
        layout: false
    })
});

module.exports = router;
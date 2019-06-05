const express = require('express')
const Book = require('./../models/Book')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('home')
})

router.get('/about', (req, res) => {
    res.render('about')
})

router.get('/faq', (req, res) => {
    res.render('faq')
})

router.get('/privacy', (req, res) => {
    res.render('privacy')
})

router.get('/terms', (req, res) => {
    res.render('terms')
})

router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/register', (req, res) => {
    res.render('register')
})

module.exports = router

const express = require('express')
const Book = require('./../models/Book')
const validationHandler = require('./../validations/validationHandler')
const { hasDescription } = require('./../validations/validators')
const router = express.Router()

router.get('/', async (req, res) => {
    res.send({ message: 'OK'})
})

router.post('/', hasDescription, async (req, res, next) => {
    try {
        // validationHandler(req)
        let book = new Book()
        book.title = req.body.title
        book.author = req.body.author
        book.isbn = req.body.isbn
        book.image = req.body.image
        book.description = req.body.description
        book.status = req.body.status
        book = await book.save()
        res.send(book)
    } catch (error) {
        next(error)
    }
})

module.exports = router

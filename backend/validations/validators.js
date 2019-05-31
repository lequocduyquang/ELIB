const { check } = require('express-validator/check')

exports.hasDescription = check('description')
    .isLength({ min: 5 })
    .withMessage('Description is required. Min length 5 characters')
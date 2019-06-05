const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CardSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    books: [
        {
            type: Schema.Types.ObjectId,
            required: true
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'TimeAllow'
    }
})

module.exports = mongoose.model('Card', CardSchema)
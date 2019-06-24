const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CardSchema = new Schema({
    startDay: {
        type: Date,
        default: Date.now
    },
    endDay: {
        type: Date,
        default: () => Date.now() + 7*24*60*60*1000
    },
    books: Array,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Card', CardSchema);

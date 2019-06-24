const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CardSchema = new Schema({
    startDay: String,
    endDay: String,
    books: Array,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Card', CardSchema);

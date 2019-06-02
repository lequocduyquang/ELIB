const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    cards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Card'
        }
    ]
})


module.exports = mongoose.model('User', UserSchema)
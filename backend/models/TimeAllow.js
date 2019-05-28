const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TimeAllowSchema = new Schema({
    time: [Number]
})

module.exports = mongoose.model('TimeAllow', TimeAllowSchema)
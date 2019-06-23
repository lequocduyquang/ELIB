const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CardSchema = new Schema({
    startDate: { type: Date, 
        default: Date.now 
    },
    endDate: { type: Date },
    books: Array,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Card', CardSchema);
module.exports = {
    DisplayListCard: () => {
        return new Promise((resolve, reject) => {
            var card = mongoose.model('Card');
            card.find({}).exec((err, res) => {
                if (err) reject(err)
                else resolve(res);
            })
        })
    }
}
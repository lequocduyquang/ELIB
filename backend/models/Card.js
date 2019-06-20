const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CardSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    // books: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         required: true,
    //         ref: 'Book'
    //     }
    // ],
    books:Array,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // period: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'TimeAllow'
    // }
})

mongoose.model('Card', CardSchema);

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
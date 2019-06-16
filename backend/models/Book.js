const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true },
    image: String,
    description: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    status: { type: Boolean },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

mongoose.model('Book', BookSchema);
var books = mongoose.model('Book', BookSchema);

module.exports = {
    add: entity => {
        return new Promise((resolve, reject) => {
            var obj = new books({
                title: entity.title,
                author: entity.author,
                isbn: entity.isbn,
                image: entity.image,
                category: entity.category,
                description: entity.description,
                status: entity.status
            })
            obj.save((err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    },

    listbook: () => {
        return new Promise((resolve, reject) => {
            var book = mongoose.model('Book');
            book.find({}).populate('category').exec((err, res) => {
                if (err) reject(err)
                else resolve(res);
            })
        })
    },

    sortbook: () => {
        return new Promise((resolve, reject) => {
            var book = mongoose.model('Book');
            book
                .find({})
                .sort({
                    createdAt: -1
                })
                .exec((err, res) => {
                    if (err) reject(err)
                    else resolve(res);
                })
        })
    },

    singlebyID: ID => {
        return new Promise((resolve, reject) => {
            var book = mongoose.model('Book');
            book.findById(ID, (err, res) => {
                if (err) reject(err)
                else resolve(res);
            })
        })
    },

    editbook: (entity, ID) => {
        return new Promise((resolve, reject) => {
            var book = mongoose.model('Book');
            book.findOneAndUpdate({ _id: ID }, entity, { new: true }, (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    },

    deletebook: (ID) => {
        return new Promise((resolve, reject) => {
            var book = mongoose.model('Book');
            book.findByIdAndRemove(ID, (err, res) => {
                if (err) reject(err)
                else resolve(res);
            })
        })
    }
}
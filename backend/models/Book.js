const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true },
    image: String,
    description: String,
    category: {
        // type: Schema.Types.ObjectId,
        // ref: 'Category'
        type: String
    },
    status: { type: Boolean }
})

mongoose.model('Book', BookSchema);
var book = mongoose.model('Book', BookSchema);

module.exports = {
    add: entity => {
        return new Promise((resolve, reject) => {
            var obj = new book({
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
            book.find((err, res) => {
                if (err) reject(err)
                else resolve(res)
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
    }
}
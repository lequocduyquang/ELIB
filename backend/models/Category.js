const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    name: { type: String, required: true },
})

mongoose.model('Category', CategorySchema);
var category = mongoose.model('Category', CategorySchema);

module.exports = {
    add: entity => {
        return new Promise((resolve, reject) => {
            var obj = new category({
                name: entity.name
            })
            obj.save((err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    },

    listcategory: () => {
        return new Promise((resolve, reject) => {
            var category = mongoose.model('Category');
            category.find((err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    },

    singlebyID: ID => {
        return new Promise((resolve, reject) => {
            var category = mongoose.model('Category');
            category.findById(ID, (err, res) => {
                if (err) reject(err)
                else resolve(res);
            })
        })
    },

    editcategory: (entity, ID) => {
        return new Promise((resolve, reject) => {
            var category = mongoose.model('Category');
            category.findOneAndUpdate({ _id: ID }, entity, { new: true }, (err, res) => {
                if (err) reject(err)
                else resolve(res)
            })
        })
    },

    deletecategory: (ID) => {
        return new Promise((resolve, reject) => {
            var category = mongoose.model('Category');
            category.findByIdAndRemove(ID, (err, res) => {
                if (err) reject(err)
                else resolve(res);
            })
        })
    }
}
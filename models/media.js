const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const MediaSchema = new Schema({
    "_id": mongoose.Schema.Types.ObjectId,
    "title": String,
    "name": String,
    "poster_image": String
});

let Media = mongoose.model('media', MediaSchema);

module.exports = Media;
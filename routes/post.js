const mongoose = require('mongoose');
// mongoose.connect("mongodb://127.0.0.1:27017/data_association_example")

const postSchema = new mongoose.Schema({

    title: String,
    description: String,
    image: String,

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

});

module.exports = mongoose.model('post', postSchema);
const mongoose = require('mongoose');
// mongoose.connect("mongodb://127.0.0.1:27017/PicBlend_project")
mongoose.connect("mongodb+srv://Admin:O1234@picblend.jnkdmd4.mongodb.net/")

const plm = require("passport-local-mongoose");
const { stringify } = require('uuid');
const { array } = require('./multer');

const userSchema = new mongoose.Schema({

    username: String,

    name: String, 

    email: String,

    password: String,

    profileImage: String,
    
    boards: {
      type: Array,
      default:[]
    },

    posts:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
      }
    ]
});

userSchema.plugin(plm); 

module.exports = mongoose.model("User", userSchema);
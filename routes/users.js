const mongoose = require('mongoose');
// mongoose.connect("mongodb://127.0.0.1:27017/PicBlend_project")

const url = process.env.DATABASE;

// console.log(url);

mongoose.connect(url, {
  // userCreateIndex: true,
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  // useFindAndModify: false
}).then(()=> {
  console.log("Connect to database")
}).catch((err)=> {
  console.log("Error to connect database", err);
})

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
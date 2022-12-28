const mongoose = require('mongoose');

//userSchema

const userSchema = new mongoose.Schema({
    // _id: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    mobile_no: { type: Number,required:true },
    
})


module.exports = mongoose.model("Users", userSchema);
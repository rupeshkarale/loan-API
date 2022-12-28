const mongoose = require('mongoose');

//userSchema

const contractSchema = new mongoose.Schema({
    lenderId: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    borrowerId: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
    principle: { type: Number, required: true },
    interest: { type: Number, required: true },
    loanStartDate: { type: String, required: true },
    loanDueDate: { type: String, required: true },
    isRepaid: { type: Boolean, required: true },

})


module.exports = mongoose.model("Contracts", contractSchema);
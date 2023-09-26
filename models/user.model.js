const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    mail: String,
    password:String,
    roles:[String],
});

module.exports = mongoose.model('User', userSchema);
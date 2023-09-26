const mongoose = require ('mongoose');

const archiveSchema = new mongoose.Schema({
    name: String,
    files: [{type: mongoose.Schema.Types.ObjectId, ref: 'File'}],
});

module.exports = mongoose.model('Archive', archiveSchema);
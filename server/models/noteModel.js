var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    note: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
});

// hash the password
noteSchema.methods.insertNote = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = mongoose.model('Note', noteSchema);

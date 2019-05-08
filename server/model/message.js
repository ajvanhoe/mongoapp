const mongoose = require('mongoose');
const {Schema} = mongoose;

const MessageSchema = new Schema({
  'name' : String,
  'message' : String,
  'created' : Date,
});

module.exports = mongoose.model('Message', MessageSchema);
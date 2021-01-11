const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter a email'],
    unique: [true, 'This email is already in use'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
  },
});

module.exports = mongoose.model('user', UserSchema);

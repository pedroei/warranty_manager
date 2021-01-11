const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter a title'],
  },
  storeName: {
    type: String,
    required: [true, 'Please enter the name of the store'],
  },
  storeUrl: {
    type: String,
  },
  document: {
    type: String,
  },
  warrantyFinalDate: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = mongoose.model('invoice', TransactionSchema);

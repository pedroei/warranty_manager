const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
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

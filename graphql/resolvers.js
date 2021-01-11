const User = require('../models/User');
const Invoice = require('../models/Invoice');

const { createUser, checkUserLogin } = require('../controllers/UserController');
const { createInvoice } = require('../controllers/InvoiceController');

//resolvers for graphql
const resolvers = {
  Query: {
    user: async (parent, { id }) => await User.findOne({ _id: id }),
    invoice: async (parent, { id }) => await Invoice.findOne({ _id: id }),
    users: async () => await User.find(),
    invoices: async () => await Invoice.find(),
  },

  User: {
    invoices: async (parent) => await Invoice.find({ user: parent.id }),
  },

  Invoice: {
    user: async (parent) => await User.findOne({ _id: parent.user }),
  },

  Mutation: {
    addUser: (_, { name, email, password }) => {
      return createUser(name, email, password);
    },

    // TODO - check if title, storeName and user are empty,
    addInvoice: (_, args) => {
      return createInvoice(args);
    },

    loginUser: (_, { email, password }) => {
      return checkUserLogin(email, password);
    },
  },
};

module.exports = resolvers;

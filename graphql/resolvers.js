const User = require('../models/User');
const Invoice = require('../models/Invoice');

const { createUser, checkUserLogin } = require('../controllers/UserController');
const {
  createInvoice,
  editInvoice,
  removeInvoice,
} = require('../controllers/InvoiceController');

//resolvers for graphql
const resolvers = {
  Query: {
    user: async (parent, { id }) => await User.findOne({ _id: id }),
    invoice: async (_, { id }) => await Invoice.findOne({ _id: id }),
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
    addUser: (_, { name, email, password }) =>
      createUser(name, email, password),

    getUser: async (_, { id }) => await User.findOne({ _id: id }),

    addInvoice: (_, args) => createInvoice(args),

    loginUser: (_, { email, password }) => checkUserLogin(email, password),

    updateInvoice: (_, args) => editInvoice(args),

    deleteInvoice: (_, { id }) => removeInvoice(id),
  },

  // Avoids warning saying that the intervface has no return on resolver
  MutationResponse: {
    __resolveType() {
      return null;
    },
  },
};

module.exports = resolvers;

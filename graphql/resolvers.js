const User = require('../models/User');
const Invoice = require('../models/Invoice');
const bcrypts = require('bcryptjs');

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
    addUser: async (_, { name, email, password }) => {
      let newUser = new User({ name, email, password });

      const salt = await bcrypts.genSalt(10);
      newUser.password = await bcrypts.hash(password, salt);

      await newUser.save();
      return newUser;
    },
    addInvoice: async (
      _,
      { title, storeName, storeUrl, document, warrantyFinalDate, userID }
    ) => {
      const newInvoice = new Invoice({
        title,
        storeName,
        storeUrl,
        document,
        warrantyFinalDate,
        user: userID,
      });
      await newInvoice.save();
      return newInvoice;
    },
  },
};

module.exports = resolvers;

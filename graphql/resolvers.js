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

  // TODO - Maybe take those functions to some controllers
  Mutation: {
    // TODO - check if email already exists, if nothing is empty, is email is an email and password at least 6 chars
    addUser: async (_, { name, email, password }) => {
      let newUser = new User({ name, email, password });

      const salt = await bcrypts.genSalt(10);
      newUser.password = await bcrypts.hash(password, salt);

      await newUser.save();
      return newUser;
    },

    // TODO - check if title, storeName and user are empty,
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

    loginUser: async (_, { email, password }) => {
      let res = {
        code: '',
        success: false,
        message: '',
        user: null,
      };
      try {
        const user = await User.findOne({ email });
        if (!user) {
          res.code = 400;
          res.message = 'Invalid Credentials';
          return res;
        }

        const isMatchPassword = await bcrypts.compare(password, user.password);
        if (!isMatchPassword) {
          res.code = 400;
          res.message = 'Invalid Credentials';
          return res;
        }

        res = {
          code: 200,
          success: true,
          message: 'Login successfully',
          user,
        };
        return res;
      } catch (e) {
        res.code = 500;
        res.message = e.message;
        return res;
      }
    },
  },
};

module.exports = resolvers;

const Invoice = require('../models/Invoice');
const User = require('../models/User');

// Creates a Invoice
const createInvoice = async ({
  title,
  storeName,
  storeUrl,
  document,
  warrantyFinalDate,
  userID,
}) => {
  let res = {
    code: '',
    success: false,
    message: '',
    invoice: null,
  };

  try {
    const userInvoice = await User.findOne({ _id: userID });

    if (!userInvoice) {
      res.code = 400;
      res.message = 'This user does not exists';
      return res;
    }

    const newInvoice = new Invoice({
      title,
      storeName,
      storeUrl,
      document,
      warrantyFinalDate,
      user: userID,
    });

    await newInvoice.save();

    return (res = {
      code: '200',
      success: true,
      message: 'Invoice created',
      invoice: newInvoice,
    });
  } catch (e) {
    if (e.message.includes('invoice validation failed:')) {
      res.code = 400;
      res.message = e.message.replace('invoice validation failed: ', '');
    } else {
      res.code = 500;
      res.message = e.message;
    }

    return res;
  }
};

module.exports = { createInvoice };

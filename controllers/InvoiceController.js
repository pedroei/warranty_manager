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
      res.code = 404;
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

// Updates an invoice
const editInvoice = async ({
  id,
  title,
  storeName,
  storeUrl,
  document,
  warrantyFinalDate,
}) => {
  let res = {
    code: '',
    success: false,
    message: '',
    invoice: null,
  };

  if (id === '') {
    res.code = 400;
    res.message = 'Add an ID';
    return res;
  }

  const invoiceFields = {};

  if (title) invoiceFields.title = title;
  if (storeName) invoiceFields.storeName = storeName;
  if (storeUrl) invoiceFields.storeUrl = storeUrl;
  if (document) invoiceFields.document = document;
  if (warrantyFinalDate) invoiceFields.warrantyFinalDate = warrantyFinalDate;

  try {
    let invoice = await Invoice.findById(id);

    if (!invoice) {
      res.code = 404;
      res.message = 'Invoice not found';
      return res;
    }

    // if i dont use { new: true }, the method findByIdAndUpdate will return the object before update
    invoice = await Invoice.findByIdAndUpdate(
      id,
      { $set: invoiceFields },
      { new: true }
    );

    return await (res = {
      code: '200',
      success: true,
      message: 'Invoice updated',
      invoice,
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

// Deletes an invoice
const removeInvoice = async (id) => {
  let res = {
    code: '',
    success: false,
    message: '',
    invoice: null,
  };

  if (id === '') {
    res.code = 400;
    res.message = 'Add an ID';
    return res;
  }

  try {
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      res.code = 404;
      res.message = 'Invoice not found';
      return res;
    }

    await Invoice.findByIdAndRemove(id);

    return (res = {
      code: '200',
      success: true,
      message: 'Invoice deleted',
      invoice: null,
    });
  } catch (e) {
    res.code = 500;
    res.message = e.message;

    return res;
  }
};

module.exports = { createInvoice, editInvoice, removeInvoice };

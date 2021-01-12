const User = require('../models/User');
const bcrypts = require('bcryptjs');

// Adds a new user
const createUser = async (name, email, password) => {
  let res = {
    code: '',
    success: false,
    message: '',
    user: null,
  };
  try {
    const user = User.find({ email });
    if (user) {
      res.code = 400;
      res.message = 'This email is already being used';
      return res;
    }

    let newUser = new User({ name, email, password });

    if (password === '') {
      res.code = 400;
      res.message = 'A password is required';
      return res;
    }
    if (password.length < 6) {
      res.code = 400;
      res.message = 'A password needs to have at least 6 characters';
      return res;
    }

    const salt = await bcrypts.genSalt(10);
    newUser.password = await bcrypts.hash(password, salt);

    await newUser.save();

    return (res = {
      code: '201',
      success: true,
      message: 'User created',
      user: newUser,
    });
  } catch (e) {
    if (e.message.includes('user validation failed:')) {
      res.code = 400;
      res.message = e.message.replace('user validation failed: ', '');
    } else if (e.message.includes('duplicate key error collection:')) {
      res.code = 400;
      res.message = 'This email is already registered';
    } else {
      res.code = 500;
      res.message = e.message;
    }

    return res;
  }
};

// Makes a user login
const checkUserLogin = async (email, password) => {
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
};

module.exports = { createUser, checkUserLogin };

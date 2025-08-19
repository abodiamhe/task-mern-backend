const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

//Genrating jwt token
const generateJWTtoken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' });

//-----------------------
// 🔹 Registring a new user functionality
//-----------------------
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  //Check is the entered email already exist in our user collection
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User exists');
  }

  //Hashing the user password before saving to user collection
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateJWTtoken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//-----------------------
// 🔹 Login a user functionality
//-----------------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  //Comparing the uer entered password to database password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateJWTtoken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
});

//-----------------------
// 🔹 Get current user data
//-----------------------
const getCurrentUser = asyncHandler(async (req, res) => {
  //Using the current login user saved in req.user to search the database
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({ id: _id, name, email });
});

module.exports = { registerUser, loginUser, getCurrentUser };

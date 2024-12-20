import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'

import User from '../models/userModel.js';
import { errorHandler } from '../utils/error.js';

export const adminSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));

    const isAdmin = await User.findOne({ email,isAdmin:true });
    if (!isAdmin) return next(errorHandler(404, 'You are not an Admin'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'wrong credentials'));
  
    const token = jwt.sign({ id: validUser._id ,role:'admin'}, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

//Fetch Users Data for table
export const fetchUsers = async (req, res) => {
  try {
      const users = await User.find({isAdmin:false});
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
  }
};

//create a new user
export const createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
   const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error);
  }
};
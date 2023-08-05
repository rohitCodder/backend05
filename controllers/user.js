import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";
import bcrypt from "bcrypt";

export const regsiter = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return next(new ErrorHandler("Please Enter all the Fields", 404));
    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("Email Already Exist", 404));
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });
    sendToken(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new ErrorHandler("please Enter all the Fields", 404));
    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid EMail Or Password", 404));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("password dosent match", 404));
    sendToken(user, res, "LoggedIn Successfully", 404);
  } catch (error) {
    next(error);
  }
};

export const getmyprofile = (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      message: "LoggedOut Successfully",
    });
};

import User from "../models/users.js";
import bcrypt from "bcrypt";
import { registerSchema } from "../schemas/usersSchemas.js";

// ----------------- Реєстрація нового користувача ---------- //
// POST /api/users/register

export const register = async (req, res, next) => {
  const { password, email, subscription } = req.body;
  const { error } = registerSchema.validate(req.body);
  if (error) {
    // Registration validation error
    return res.status(400).send({ message: error.message });
  }
  // const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user !== null) {
      return res.status(409).send({ message: "User already registered " });
    }
    const passvordHash = await bcrypt.hash(password, 10);

    await User.create({
      password: passvordHash,
      email: req.body.email,
    });

    res.status(201).send({ massage: "Registration succesfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { password, email } = req.body;
  // const emailInLowerCase = email.toLowerCase();
  const { error } = registerSchema.validate(req.body);
  if (error) {
    // Login validation error
    return res.status(400).send({ message: error.message });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      console.log("Email");
      return res
        .status(401)
        .send({ message: "Email or passvord is incorect " });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      console.log("Passvord");
      return res
        .status(401)
        .send({ message: "Email or passvord is incorect " });
    }

    res.send({ token: "Token" });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
};

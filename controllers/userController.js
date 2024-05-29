import Jimp from "jimp";
import { promises as fs } from "fs";
import User from "../models/user.js";
import path from "path";
import { error, log } from "console";

const avatarsDir = path.resolve("public", "avatars");

// PATCH /users/avatars
const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "Avatar file is required" });
    }

    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    const { path: tempUpload, originalname } = req.file;
    const ext = path.extname(originalname);
    console.log("ext: " + ext);

    const name = path.basename(originalname, ext);
    console.log("name: " + name);

    const newFilename = `${req.user.id}_${name}${ext}`;
    console.log("newFilename: " + newFilename);
    const resultUpload = path.resolve(avatarsDir, newFilename);

    await Jimp.read(tempUpload)
      .then((image) => image.resize(250, 250).write(resultUpload))
      .catch((err) => {
        next(error);
      });

    await fs.unlink(tempUpload);

    const avatarURL = `/avatars/${newFilename}`;
    user.avatarURL = avatarURL;
    await user.save();

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    // Clear the verificationToken and set the user as verified
    const user = await User.findOneAndUpdate(
      { verificationToken },
      { verify: true, verificationToken: " " }
    );

    // Verification user Not Found
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    // save user
    await user.save();

    // Verification success response
    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

// Контролер повторної відправки

// POST /users/ verify/ :verificationToken
const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    //  Якщо в body немає обов'язкового поля email
    if (!email) {
      return res.status(400).send({ message: "missing required field email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Якщо користувач вже пройшов верифікацію
    if (user.verify === true) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    // повторна відправка листа з verificationToken на вказаний email
    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

export default { updateAvatar, verify, resendVerificationEmail };

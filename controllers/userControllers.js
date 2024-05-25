// import * as fs from "node:fs/promises";
// import path from "node:path";

// import User from "../models/user.js";

// async function getAvatar(req, res, next) {
//   try {
//     const user = await User.findById(req.user.id);

//     if (user === null) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     if (user.avatar === null) {
//       return res.status(404).send({ message: "Avatar not found" });
//     }

//     res.sendFile(path.resolve("public/avatars", user.avatar));
//   } catch (error) {
//     next(error);
//   }
// }

// async function uploadAvatar(req, res, next) {
//   try {
//     await fs.rename(
//       req.file.path,
//       path.resolve("public/avatars", req.file.filename)
//     );

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { avatar: req.file.filename },
//       { new: true }
//     );

//     if (user === null) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     res.send(user);
//   } catch (error) {
//     next(error);
//   }
// }

// export default { getAvatar, uploadAvatar };
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

export default { updateAvatar };

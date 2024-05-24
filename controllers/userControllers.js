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

// імпорт адреси папки C:\Users\terlo\Documents\GitHub\goit-node-rest-api\public\avatars
const avatarsDir = path.resolve("public", "avatars");

// Контролер для оновлення аватарки користувача

// PATCH /users/avatars
const updateAvatar = async (req, res, next) => {
  try {
    // Перевірка наявності завантаженого файлу
    if (!req.file) {
      return res.status(400).send({ message: "Avatar file is required" });
    }
    // Знайти користувача за ID
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatarURL === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }

    // обробка завантаженого файлу

    // деструктуризація для вилучення властивостей path та originalname з об'єкта req.file
    const { path: tempUpload, originalname } = req.file;
    const ext = path.extname(originalname);
    console.log("ext: " + ext); // .png

    const name = path.basename(originalname, ext);
    console.log("name: " + name); // user

    const newFilename = `${req.user.id}_${name}${ext}`;
    console.log("newFilename: " + newFilename); // 663e314c59bf2fa04eef430e.png
    const resultUpload = path.resolve(avatarsDir, newFilename);

    // Обробка аватару пакетом jimp, resize 250*250
    await Jimp.read(tempUpload)
      .then((image) => image.resize(250, 250).write(resultUpload))
      .catch((err) => {
        // throw new Error(err);
        next(error);
      });

    // Видалити тимчасовий файл
    await fs.unlink(tempUpload);

    // збереження URL в поле avatarURL користувача
    const avatarURL = `/avatars/${newFilename}`;
    user.avatarURL = avatarURL;
    await user.save();

    // Відповісти з новим URL аватару
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export default { updateAvatar };

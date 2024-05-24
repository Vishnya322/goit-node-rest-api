// import express from "express";
// import UserController from "../controllers/userControllers.js";
// import uploadMiddleware from "../middleware/upload.js";
// import authToken from "../middleware/authToken.js";

// const avatarRouter = express.Router();

// avatarRouter.get("/avatar", UserController.getAvatar);

// avatarRouter.patch(
//   "/avatars",
//   uploadMiddleware.single("avatar"),
//   UserController.uploadAvatar
// );

// export default avatarRouter;
import express from "express";
import UserController from "../controllers/userControllers.js";
import uploadMiddleware from "../middleware/upload.js";
import authToken from "../middleware/authToken.js";

// імпорт у змінну результату виконання express роутера
const router = express.Router();

// PATCH / users / avatars
router.patch(
  "/avatars",
  authToken,
  uploadMiddleware.single("avatar"),
  UserController.updateAvatar
);

export default router;

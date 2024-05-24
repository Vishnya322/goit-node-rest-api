import express from "express";
import UserController from "../controllers/userControllers.js";
import uploadMiddleware from "../middleware/upload.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();

// PATCH / users / avatars
router.patch(
  "/avatars",
  authToken,
  uploadMiddleware.single("avatar"),
  UserController.updateAvatar
);

export default router;

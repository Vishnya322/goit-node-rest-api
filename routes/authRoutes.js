import express from "express";
import AuthController from "../controllers/authControllers.js";

const authRoutes = express.Router();
const jsonParser = express.json();

authRoutes.post("/register", jsonParser, AuthController.register);
authRoutes.post("/login", jsonParser, AuthController.login);

export default authRoutes;

import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import mongoose from "mongoose";
import authTokenUsePassport from "./middleware/authTokenUsePassport.js";
import authToken from "./middleware/authToken.js";
import usersRoutes from "./routes/usersRouter.js";
import "dotenv/config";
import path from "path";
import nodemailer from "nodemailer";

const { MAILTRAP_USERNAME, MAILTRAP_PASSWORD } = process.env;
console.log(MAILTRAP_USERNAME);
console.log(MAILTRAP_USERNAME);

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  type: "login",
  auth: {
    user: MAILTRAP_USERNAME,
    pass: MAILTRAP_PASSWORD,
  },
});

const message = {
  to: "Vishnya322@gmail.com",
  from: "Vishnya322@gmail.com",
  subject: "Hello from Node.js",
  html: `<h1 style="color: red"> Goit courses finishing</h1>`,
  text: "Hello on Goit courses",
};

transport.sendMail(message).then(console.log).catch(console.error);

const app = express();

app.use(morgan("tiny")); //
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use("/contacts", authTokenUsePassport, contactsRouter);
app.use("/users", authRouter);

app.use("/users", usersRoutes);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.info("Database connection successful");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);

    process.exit(1);
  });

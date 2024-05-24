import jwt from "jsonwebtoken";

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token" });
  }
  const [bearer, token] = authHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }
  jwt.verify(token, process.env.SECRET, (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    req.user = {
      id: decode.id, // або user._id
      email: decode.email, // або user.email
    };
    next();
  });
};

export default authToken;
// export const authToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(401).send({ message: "No token provided" });
//   }
//   const [bearer, token] = authHeader.split(" ", 2);
//   if (bearer !== "Bearer" || !token) {
//     return res.status(401).send({ message: "Invalid token" });
//   }
//   jwt.verify(token, process.env.SECRET, (err, decode) => {
//     if (err) {
//       return res.status(401).send({ message: "Invalid token" });
//     }
//     req.user = {
//       id: decode.id,
//       email: decode.email,
//     };
//     next();
//   });
// };

// export default authToken;
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config(); // Завантаження значень з файлу .env

// export const authToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     console.log("No authorization header");
//     return res.status(401).send({ message: "No token provided" });
//   }
//   const [bearer, token] = authHeader.split(" ", 2);
//   if (bearer !== "Bearer" || !token) {
//     console.log("Invalid token format");
//     return res.status(401).send({ message: "Invalid token" });
//   }
//   console.log("Token received:", token);
//   console.log("Secret key:", process.env.SECRET);

//   jwt.verify(token, process.env.SECRET, (err, decode) => {
//     if (err) {
//       console.log("Token verification failed:", err);
//       return res.status(401).send({ message: "Invalid token" });
//     }
//     console.log("Token verified, user decoded:", decode);
//     req.user = {
//       id: decode.id,
//       email: decode.email,
//     };
//     next();
//   });
// };

// export default authToken;

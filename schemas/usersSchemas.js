import Joi from "joi";

// Schema for validating POST /users/register

export const registerSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(6).required(),
});

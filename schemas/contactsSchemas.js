import Joi from "joi";
export const contactIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const createContactSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim(),
  email: Joi.string().trim(),
  phone: Joi.string().trim(),
});
export const validateContactId = (id) => {
  const { error } = contactIdSchema.validate(id);
  return error ? error.details[0].message : null;
};

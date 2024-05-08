import { contactIdSchema } from "../schemas/contactsSchemas.js";

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { contactId } = req.params;
    const { error: idError } = contactIdSchema.validate(contactId);
    if (idError) {
      return res.status(400).send(idError.message);
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send(error.message);
    }

    next();
  };

  return func;
};
export default validateBody;

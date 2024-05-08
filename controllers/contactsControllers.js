import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contacts.js";
import { validateContactId } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import { updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const idError = validateContactId(id);
  if (idError) {
    return res.status(400).send(idError);
  }
  try {
    const contact = await Contact.findById(id);
    console.log(contact);
    if (contact === null) {
      throw HttpError(404);
      // return res.status(404).send("Contact not found");
    }

    res.status(200).send(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (contact === null) {
      throw HttpError(404);
    }

    res.send(contact);
  } catch (error) {
    next(error.status ? error : {});
  }
};

export const createContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  try {
    const result = await Contact.create(contact);

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;

  // Validate the id format using the defined schema
  const idValidationMessage = validateContactId(id);
  if (idValidationMessage) {
    return res.status(400).send(idValidationMessage);
  }
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  try {
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });
    console.log(result);
    if (!result) {
      throw HttpError(404, "Contact not found");
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const updateFavoriteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  try {
    if (typeof favorite !== "boolean") {
      return res
        .status(400)
        .send("Invalid value for 'favorite'. Must be a boolean.");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).send("Contact not found");
    }

    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};

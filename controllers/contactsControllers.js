import contactsServices from "../services/contactsServices.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsServices.listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.getContactById(id);

    if (!result) throw HttpError(404);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsServices.removeContact(id);
    if (!contact) {
      throw HttpError(404);
    }

    res.json(contact);
  } catch (error) {
    next(error.status ? error : {});
  }
};

export const createContact = async (req, res, next) => {
  try {
    // Додайте middleware для валідації тіла запиту перед додаванням контакту
    const middleware = validateBody(createContactSchema);

    // Виклик middleware для валідації тіла запиту
    middleware(req, res, async (error) => {
      try {
        if (error) {
          return res.status(error.status).json({ message: error.message });
        }

        // Якщо дані пройшли валідацію, додайте контакт
        const { name, email, phone } = req.body;
        const contact = await contactsServices.addContact(name, email, phone);

        // Відправте відповідь з новоствореним контактом і статусом 201 (Created)
        res.status(201).json(contact);
      } catch (error) {
        next(error); // Передайте помилку до обробника помилок Express
      }
    });
  } catch (error) {
    next(error); // Обробляйте інші помилки, якщо вони виникають у спробі створення контакту
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0)
      throw HttpError(400, "Body must have at least one field");

    const { id } = req.params;
    const contact = await contactsServices.updateContact(id, req.body);

    if (!contact) throw HttpError(404);

    res.json(contact);
  } catch (error) {
    next(error.status ? error : {});
  }
};
export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
};

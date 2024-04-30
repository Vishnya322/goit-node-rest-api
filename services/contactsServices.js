import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

// const contactsPath = new URL("./contacts.json", import.meta.url);
const contactsPath = path.resolve("db", "contacts.json");

// Функція для отримання списку контактів
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    next(error);
  }
}

// Функція для отримання контакту за ідентифікатором
// async function getContactById(contactId) {
//   try {
//     const contacts = await listContacts();
//     const contact = contacts.find((c) => c.id === contactId);
//     return contact || null;
//   } catch (err) {
//     throw err;
//   }
// }
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();

    const data = contacts.find((contact) => contact.id === contactId);

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    next(error);
  }
}

// Функція для видалення контакту за ідентифікатором
async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
      return null;
    } else {
      const deletedData = contacts.splice(index, 1)[0];
      await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
      return deletedData;
    }
  } catch (err) {
    throw err;
  }
}

// Функція для додавання нового контакту
async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = { name, email, phone, id: crypto.randomUUID() };
    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (err) {
    throw err;
  }
}

// Експорт об'єкта, що містить всі функції контактів
const contactsServices = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

export default contactsServices;

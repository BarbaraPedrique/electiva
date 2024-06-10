import {
  getAllRegistersByCollection,
  addDataToCollection,
  updateDataInCollection,
  deleteDataFromCollection,
} from "./app/firestore/firestore-config.js";

import inquirer from "inquirer";
import schemas from "./app/schemas/schemas.js";
const schemaInquererGenerator = async (
  collectionName,
  register = undefined
) => {
  const schema = register ? JSON.parse(register) : schemas[collectionName];
  const newData = {};
  for (const key in schema) {
    if (key !== "id") {
      const data = await inquirer.prompt([
        {
          type: "input",
          message: `Ingrese el nuevo valor para el campo ${key}`,
          name: "value",
          default: schema[key],
        },
      ]);
      newData[key] = data.value;
    }
  }
  return newData;
};

const handleOperation = async (operation, collectionName) => {
  const { option } = operation;
  if (option === "Obtener todo los registros") {
    const values = await getAllRegistersByCollection(collectionName.option);
    const choices = values.map((value) => JSON.stringify(value));
    choices.push("salir");
    choices.unshift("salir");
    const { register } = await inquirer.prompt({
      type: "list",
      message: `Si seleciona un registro podras actualizar o eliminar el registro selecciondo en la coleccion (${collectionName.option})`,
      name: "register",
      choices: choices,
    });
    if (register != "salir") {
      const { option } = await inquirer.prompt({
        type: "list",
        message: `Que operacion deseas realizar en el registro seleccionado?`,
        name: "option",
        choices: ["Actualizar", "Eliminar"],
      });
      if (option === "Actualizar") {
        const newData = await schemaInquererGenerator(
          collectionName.option,
          register
        );
        return updateDataInCollection(
          collectionName.option,
          JSON.parse(register).id,
          newData
        );
      }
      if (option === "Eliminar") {
        return deleteDataFromCollection(
          collectionName.option,
          JSON.parse(register).id
        );
      }
    }
  }
  if (option === "Crear un nuevo registro") {
    console.log(collectionName.option);
    const newRegister = await schemaInquererGenerator(collectionName.option);
    return addDataToCollection(collectionName.option, newRegister);
  }
  if (option === "Salir") {
    process.exit();
  }
};

const collectionName = await inquirer.prompt({
  type: "list",
  message: "Que colección desea manipular?",
  name: "option",
  choices: ["users", "products", "events", "<Salir>"],
});

if (collectionName.option === "<Salir>") {
  process.exit();
}

const operation = await inquirer.prompt({
  type: "list",
  message: `Que operacion deseas realizar en la coleccion (${collectionName.option})?`,
  name: "option",
  choices: ["Obtener todo los registros", "Crear un nuevo registro", "Salir"],
});

await handleOperation(operation, collectionName);

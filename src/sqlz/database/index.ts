import { Sequelize } from "sequelize-typescript";
import { Company } from "../models/Company";
import  Whatsapp  from "../models/Whatsapp";


// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";

const sequelize = new Sequelize(dbConfig);
const models = [
  // User,
  // Contact,
  // ClosedStatus,
  // Ticket,
  // Message,
  Whatsapp,
  // ContactCustomField,
  // Setting,
  // Queue,
  Company,
  // WhatsappQueue,
  // UserQueue,
  // QuickAnswer,
  // Plan,
  // Billing,
  // Status
];

sequelize.addModels(models);
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});
export default sequelize;

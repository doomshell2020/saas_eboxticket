import Sequelize from "sequelize";
import config from "./config/config.js"; // ✅ ensure .js if using ES modules

let sequelize;

console.log("Current NODE_ENV:", process.env.NODE_ENV);
console.log("Database Config:", config);

try {
  // Choose config based on NODE_ENV
  switch (process.env.NODE_ENV) {
    case "production":
      sequelize = new Sequelize(config.production);
      break;
    case "staging":
      sequelize = new Sequelize(config.staging);
      break;
    case "test":
      sequelize = new Sequelize(config.test);
      break;
    case "development":
      sequelize = new Sequelize(config.development);
      break;
    default:
      sequelize = new Sequelize(config.development);
      break;
  }

  // ✅ Test database connection
  await sequelize.authenticate();
  console.log("✅ Database connection has been established successfully.");
} catch (error) {
  console.error("❌ Unable to connect to the database:", error.message);
  //   process.exit(1); // Exit the app if DB connection fails
}

const connection = sequelize;

export { sequelize }; // Named export
export default connection;

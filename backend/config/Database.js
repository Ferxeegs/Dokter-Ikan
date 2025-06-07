import { Sequelize } from "sequelize";

const db = new Sequelize('dokteri2_db_dokterikan', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;

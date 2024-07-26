import pg from "pg";
import createUrlsTable from "../models/url.js";
import createUsersTable from "../models/user.js";
const { Client } = pg;
import dotenv from "dotenv";

dotenv.config();

const database = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

async function testConnectionAndLog() {
  try {
    await database.connect();
    const queryTime = await database.query("SELECT NOW()");
    const databaseName = await database.query("SELECT current_database()");
    const currentTime = queryTime.rows[0].now;
    const currentDatabase = databaseName.rows[0].current_database;
    console.log(`Connected to ${currentDatabase} at ${currentTime}`);
    await createUrlsTable();
    await createUsersTable();
  } catch (error) {
    console.error("Error connecting to database", error);
  }
}

testConnectionAndLog();

export default database;

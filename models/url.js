import database from "../config/connection_db.js";
const createUrlTableSQL = `
CREATE TABLE IF NOT EXISTS url (
    id serial PRIMARY KEY,
    long_url varchar(255),
    short_id varchar(8),
    short_url varchar(255),
    user_clicks integer DEFAULT 0,
    created_by integer REFERENCES users (id),
    created_at timestamp DEFAULT NOW()
);
`;
async function createUrlsTable() {
  try {
    await database.query(createUrlTableSQL);
    console.log("Url table created");
  } catch (error) {
    return console.log("Error creating url table", error);
  }
}

export default createUrlsTable;

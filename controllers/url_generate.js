import { query } from "express";
import database from "../config/connection_db.js";
import { nanoid } from "nanoid";

async function shortUrl(req, res) {
  const insertLongUrlSQL =
    "INSERT INTO url(created_by, long_url, short_id, short_url) VALUES ($1,$2,$3, $4) RETURNING id";
  const created_by = req.body.created_by;
  const long_url = req.body.long_url;
  const short_id = nanoid(8);
  const short_url = `http://localhost:3000/${short_id}`;

  if (!created_by || !long_url) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const result = await database.query(insertLongUrlSQL, [
      created_by,
      long_url,
      short_id,
      short_url,
    ]);
    const shortUrl = `http://localhost:3000/${short_id}`;
    return res
      .status(201)
      .json({ message: "Url registered successfully", short_url: shortUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const urlController = {
  shortUrl,
};

export default urlController;

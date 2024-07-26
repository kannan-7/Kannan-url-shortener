import database from "../../config/connection_db.js";

const query = `
SELECT * FROM url WHERE short_id = $1`;

async function redirectUrl(req, res) {
  try {
    const short_id = req.params.id;
    const urlid = await database.query(query, [short_id]);
    console.log(short_id);
    const url = urlid.rows[0];
    if (short_id) {
      res.redirect(short_id.long_url);
    }

    const data = {
      message: "URL redirected successfully",
      data: url,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export default redirectUrl;

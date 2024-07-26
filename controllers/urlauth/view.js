import database from "../../config/connection_db.js";

const query = `
SELECT * FROM url
WHERE created_by = $1;
`;

async function viewUrl(req, res) {
  try {
    const createdBy = req.user.id;
    const dbRes = await database.query(query, [createdBy]);
    const url = dbRes.rows;
    const data = {
      message: "Url listed successfully",
      data: url,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default viewUrl;

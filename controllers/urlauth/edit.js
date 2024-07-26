import database from "../../config/connection_db.js";

const getUrlQuery = `
SELECT FROM url WHERE id = $1 AND created_by = $2;
`;

const updateQuery = `
UPDATE url
SET name = $1, long_url = $2
WHERE id = $3 AND created_by = $4
`;

async function editUrl(req, res) {
  try {
    const name = req.body.name;
    const long_url = req.body.long_url;

    const urlId = req.params.id;
    const userId = req.user.id;
    const getUrlDb = await database.query(getUrlQuery, [urlId, userId]);
    const defaultUrl = getUrlDb.rows[0];

    if (!defaultUrl) {
      return res.status(404).json({ error: "Url not found" });

      const value = [name || defaultUrl.name, long_url || urlId, userId];
      const dbRes = await database.query(updateQuery, values);

      if (dbRes.rowCount === 0) {
        return res.status(404).json({ error: "Url not found" });
      }
    }
    const data = {
      message: `Url updated id ${urlId} successfully`,
    };
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export default editUrl;

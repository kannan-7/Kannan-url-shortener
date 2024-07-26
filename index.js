import express from "express";
import database from "./config/connection_db.js";
import router from "./routes/routes.js";

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import database from "../config/connection_db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function registerUser(req, res) {
  const insertUserSQL =
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id";

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // convert password to hash using bcrypt
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  try {
    const resDb = await database.query(insertUserSQL, [
      username,
      email,
      hashPassword,
    ]);
    const userId = resDb.rows[0].id;
    const resData = {
      message: "User registered successfully",
      data: {
        userId: userId,
        username: username,
        email: email,
      },
    };

    return res.status(201).json(resData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function loginUser(req, res) {
  const selectUserSQL = "SELECT * From users WHERE email = $1";
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const resDb = await database.query(selectUserSQL, [email]);
    if (resDb.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = resDb.rows[0];
    const dbPassword = user.password;

    const isPasswordMatch = bcrypt.compareSync(password, dbPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    const configJWT = {
      expiresIn: "1h",
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, configJWT);

    const resData = {
      message: "Login successful",
      token: token,
    };

    return res.status(200).json(resData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const authController = {
  registerUser,
  loginUser,
};

export default authController;

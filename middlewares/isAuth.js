import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function isAuth(req, res, next) {
  const headers = req.headers;
  const token = headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const producedAt = new Date(decoded.iat * 1000);
  console.log("Token produced at: ", producedAt);

  const now = new Date();
  const diff = now - producedAt;
  const diffInHours = diff / 1000 / 60 / 60;

  const expirationTime = producedAt.setHours(producedAt.getHours() + 1);

  if (diffInHours > 10) {
    return res.status(401).json({ messahe: "Unauthorizes" });
  }

  req.user = {
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
    expirationTime:
      new Date(expirationTime).toLocaleDateString() +
      " " +
      new Date(expirationTime).toLocaleTimeString(),
  };

  next();
}

export default isAuth;

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1];
    if(!token) return res.status(401).json({message: "No token provided"});

    try {
        const decode = jwt.verify(token, JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).json({message: "Invalid token"});
    }
}

export default authMiddleware

export const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied: Admins only." });
    }
  } catch (err) {
    res.status(500).json({ message: "Authorization error." });
  }
};
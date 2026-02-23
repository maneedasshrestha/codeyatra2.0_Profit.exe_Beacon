import jwt from "jsonwebtoken";
import "dotenv/config";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No auth header or invalid format");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode the JWT without verification to extract the user info
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.sub) {
      console.log("Invalid token: cannot decode or missing sub");
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      console.log("Token expired");
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }

    // Set user object with the decoded token data
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.log("Auth error:", err.message);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

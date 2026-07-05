import { validateUserToken } from "../utils/token.utils.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return next();

  if (!authHeader.startsWith("Bearer")) {
    return res
      .status(400)
      .json({ error: "Authorization header must start with Bearer." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Authorization token is missing." });
  }

  const payload = validateUserToken(token);

  // TODO: Debugg the Code
  // console.log(payload);

  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }

  req.user = payload;
  next();
}

export async function ensureAuthenticated(req, res, next) {
  // TODO: Debugg the Code
  // console.log("req.user:", req.user);

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      error: "You must be logged in."
    });
  }

  next();
}
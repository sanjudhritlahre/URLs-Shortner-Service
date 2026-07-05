import { validateUserToken } from "../utils/token.utils.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return next();

  if (!authHeader.startsWith("Bearer")) {
    return res
      .status(400)
      .json({ error: "Authorization header must be start with Bearer." });
  }

  // [Bearer, <Token>]
  const [_, token] = authHeader.split(" ");
  const payload = validateUserToken(token);

  req.user = payload;
  next();
}

import jwt from "jsonwebtoken";
import { userTokenSchema } from "../validations/token.validations.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export async function createUserToken(payload) {
  const validationResult = await userTokenSchema.safeParseAsync(payload);

  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }

  const payloadValidatedData = validationResult.data;

  const token = jwt.sign(payloadValidatedData, JWT_SECRET, { expiresIn: "7d" });
  return token;
}

export function validateUserToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

import jwt from "jsonwebtoken";
import { userTokenSchema } from "../validations/token.validations.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const createUserToken = async (payload) => {
  const validationResult = await userTokenSchema.safeParseAsync(payload);
  
  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }

  const payloadValidatedData = validationResult.data;

  const token = jwt.sign(payloadValidatedData, JWT_SECRET, { expiresIn: "7d" });
  return token;
};
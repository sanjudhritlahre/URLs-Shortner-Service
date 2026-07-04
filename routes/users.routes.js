import express from "express";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { usersTable } from "../models/users.models.js";
import { signUpPostRequestSchema } from "../validations/request.validations.js";
import { hashPasswordWithSalt } from "../utils/hash.utils.js";
import { getUserByEmail, createUser } from "../services/users.services.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const validationsResult = await signUpPostRequestSchema.safeParseAsync(req.body);

    if (!validationsResult.success) {
      return res.status(400).json({
        errors: validationsResult.error.flatten(),
      });
    }

    const { firstName, lastName, email, password } = validationsResult.data;
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .json({ error: `User with email ${email} already exists!` });
    }

    // Hashing Password
    const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

    // Create a New User
    const user = await createUser({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      salt,
    });

    return res.status(201).json({ data: { userId: user.id } });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

export default router;

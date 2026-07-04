import express from "express";
import { db } from "../db/index.js";
import { usersTable } from "../models/users.models.js";
import {
  signUpPostRequestSchema,
  loginPostRequestBodySchema,
} from "../validations/request.validations.js";
import { hashPasswordWithSalt } from "../utils/hash.utils.js";
import { getUserByEmail, createUser } from "../services/users.services.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const validationsResult = await signUpPostRequestSchema.safeParseAsync(
      req.body,
    );

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
    const { salt, hashedPassword } = hashPasswordWithSalt(password);

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

router.post("/login", async (req, res) => {
  try {
    const validationResult = await loginPostRequestBodySchema.safeParse(
      req.body,
    );

    if (!validationResult.success) {
      return res.status(400).json({
        errors: validationResult.error.flatten(),
      });
    }

    const { email, password } = validationResult.data;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const { hashedPassword } = hashPasswordWithSalt(password, user.salt);

    if (user.password !== hashedPassword) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not configured.");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

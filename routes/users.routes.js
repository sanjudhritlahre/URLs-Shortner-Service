import express from "express";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { usersTable } from "../models/users.models.js";
import { randomBytes, createHmac } from "node:crypto";
import { signUpPostRequestSchema } from "../validations/request.validations.js";

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

    const [existingUser] = await db
      .select({
        id: usersTable.id,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser) {
      return res
        .status(400)
        .json({ error: `User with email ${email} already exists!` });
    }

    const salt = randomBytes(256).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const [user] = await db
      .insert(usersTable)
      .values({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        salt,
      })
      .returning({ id: usersTable.id });

    return res.status(201).json({ data: { userId: user.id } });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

export default router;

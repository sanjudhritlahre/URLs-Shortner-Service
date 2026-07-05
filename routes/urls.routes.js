import express from "express";
import { shortenPostRequestBodySchema } from "../validations/request.validations.js";
import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";

const router = express.Router();

router.post("/shorten", async (req, res) => {
  const userID = req.user?.id;

  if (!userID) {
    return res
      .status(401)
      .json({ error: "You must be logged in to access this resource." });
  }

  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.flatten() });
  }

  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);

  const [result] = await db
    .insert(urlsTable)
    .values({
      userId: req.user.id,
      shortCode,
      targetURL: url,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return res
    .status(201)
    .json({
      id: result.id,
      shortCode: result.shortCode,
      targetURL: result.targetURL,
    });
});

export default router;

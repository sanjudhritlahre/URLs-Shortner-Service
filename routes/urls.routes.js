import express from "express";
import { shortenPostRequestBodySchema } from "../validations/request.validations.js";
import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { createShortenUrl } from "../services/urls.services.js";

const router = express.Router();

router.post("/shorten", ensureAuthenticated, async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.flatten() });
  }

  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);

  // Create a Shorten Url
  const result = await createShortenUrl({
    userId: req.user.id,
    targetURL: url,
    shortCode,
  });

  return res.status(201).json({
    id: result.id,
    targetURL: result.targetURL,
    shortCode: result.shortCode,
  });
});

export default router;

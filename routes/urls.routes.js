import express from "express";
import { shortenPostRequestBodySchema } from "../validations/request.validations.js";
import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import { createShortenUrl } from "../services/urls.services.js";
import { and, eq } from "drizzle-orm";

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

router.get('/codes', ensureAuthenticated, async function (req, res) {
  const codes = await db
    .select()
    .from(urlsTable)
    .where(eq(urlsTable.userId, req.user.id));

  return res.json({ codes });
});

router.delete('/:id', ensureAuthenticated, async function (req, res) {
  const id = req.params.id;
  await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)));

  return res.status(200).json({ deleted: true });
});

router.get("/:shortCode", async (req, res) => {
  const code = req.params.shortCode;

  const [result] = await db
    .select({ targetURL: urlsTable.targetURL })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res.status(404).json({ error: "Invalid URL!" });
  }

  return res.redirect(result.targetURL);
});

export default router;

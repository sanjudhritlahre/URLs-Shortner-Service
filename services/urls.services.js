import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";

export async function createShortenUrl({ userId, shortCode, targetURL }) {
  const [shorten] = await db
    .insert(urlsTable)
    .values({
      userId,
      shortCode,
      targetURL,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return shorten;
}

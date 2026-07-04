import { db } from "../db/index.js";
import { usersTable } from "../models/users.models.js";

export async function getUserByEmail(email) {
  const [existingUser] = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return existingUser;
}

export async function createUser({
  email,
  firstName,
  lastName,
  password,
  salt,
}) {
  const [user] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      password,
      salt,
    })
    .returning({ id: usersTable.id });

  return user;
}

const db = require("../config/dbConnection");
const { eq } = require("drizzle-orm");
const { passwordResetTokens } = require("../models/schema/passwordResetTokens");

const insertToken = async (userId, resetToken, expirationDate) => {
  const [token] = await db
    .insert(passwordResetTokens)
    .values({
      userId,
      resetToken,
      expirationDate,
    })
    .returning();

  return token;
};

const retrieveToken = async (token) => {
  const [retrievedToken] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.resetToken, token))
    .limit(1);

  return retrievedToken;
};

const deleteToken = async (token) => {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.resetToken, token));
};

module.exports = { insertToken, retrieveToken, deleteToken};
const {db} = require("../config/dbConnection");
const { eq } = require("drizzle-orm");
const { users } = require("../models/schema/users");

const getUserByEmail = async (email) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    return user;
};

const getUserById = async (userId) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id_user, userId))
        .limit(1);

    return user;
};

const updateUser = async (userID, updates) => {
    const updatedUser = await db
            .update(users)
            .set(updates)
            .where(eq(users.id_user, userID))
            .returning();

    return updatedUser[0];
};

const createUser = async (data) => {
    const [user] = await db
        .insert(users)
        .values(data)
        .returning();

    return user;
};

const changeUserPassword = async (userId, hashedPassword) => {
    const [user] = await db
        .update(users)
        .set({
            passwordHash: hashedPassword,
            updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

    return user;
};


module.exports = { getUserByEmail, createUser, changeUserPassword, getUserById, updateUser }
const { db } = require("../config/dbConnection");
const { eq, desc } = require("drizzle-orm");
const { users } = require("../models/schema/users");
const { profileRequests } = require("../models/schema/profileRequests");

const acceptUser = async (id, hashedPassword) => {
    const [request] = await db
        .select()
        .from(profileRequests)
        .where(eq(profileRequests.idRequest, id))
        .limit(1);

    if (!request) {
        throw new Error("Profile request not found.");
    }

    const [user] = await db
        .insert(users)
        .values({
            fullName: request.fullName,
            email: request.email,
            role: request.role,
            walletAddress: request.walletAddress,
            companyName: request.companyName,
            passwordHash: hashedPassword,
            isActive: true,
        })
        .returning();

    await db
        .update(profileRequests)
        .set({
            status: "APPROVED",
        })
        .where(eq(profileRequests.idRequest, id));

    return user;
};

const rejectUser = async (id) => {
    const [request] = await db
        .select()
        .from(profileRequests)
        .where(eq(profileRequests.idRequest, id))
        .limit(1);

    if (!request) {
        throw new Error("Profile request not found.");
    }

    const [updatedRequest] = await db
        .update(profileRequests)
        .set({
            status: "REJECTED",
        })
        .where(eq(profileRequests.idRequest, id))
        .returning();

    return updatedRequest;
};

const getRequestAccounts = async () => {
    const requests = await db
        .select()
        .from(profileRequests)
        .where(eq(profileRequests.status, "PENDING"))
        .orderBy(desc(profileRequests.createdAt));

    return requests;
};

module.exports = { acceptUser, rejectUser, getRequestAccounts }
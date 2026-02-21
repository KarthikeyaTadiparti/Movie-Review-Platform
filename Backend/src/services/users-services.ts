import db from "../config/db.ts";
import { users, NewUser } from "../schema/users-schema.ts";
import { eq, and } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
};

export const createUser = async (userData: NewUser) => {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
};

export const getUserById = async (id: number) => {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
};

export const updateUser = async (id: number, userData: Partial<NewUser>) => {
    const result = await db
        .update(users)
        .set({ ...userData, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
    return result[0];
};

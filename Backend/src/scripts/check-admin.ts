import db from "../config/db.ts";
import { users } from "../schema/users-schema.ts";
import { eq } from "drizzle-orm";

async function checkAdmin() {
    const adminEmail = "[EMAIL_ADDRESS]";
    const user = await db.select().from(users).where(eq(users.email, adminEmail));

    if (user.length > 0) {
        console.log(`User ${adminEmail} found:`, user[0]);
        if (user[0].role !== "admin") {
            console.log("Updating role to admin...");
            await db.update(users).set({ role: "admin" }).where(eq(users.email, adminEmail));
            console.log("Role updated successfully!");
        } else {
            console.log("Role is already admin.");
        }
    } else {
        console.log(`User ${adminEmail} not found.`);
    }
    process.exit(0);
}

checkAdmin();

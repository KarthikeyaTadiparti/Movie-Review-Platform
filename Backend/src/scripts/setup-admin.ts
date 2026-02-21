import db from "../config/db.ts";
import { users } from "../schema/users-schema.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function setupAdmin() {
    const adminEmail = "admin@gmail.com";
    const user = await db.select().from(users).where(eq(users.email, adminEmail));

    if (user.length === 0) {
        console.log("Admin user not found. Creating admin...");
        const hashedPassword = await bcrypt.hash("1", 10);
        await db.insert(users).values({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });
        console.log("Admin created successfully! Email: admin@gmail.com, Password: 1");
    } else {
        console.log("Admin user already exists. Checking role...");
        if (user[0].role !== "admin") {
            await db.update(users).set({ role: "admin" }).where(eq(users.email, adminEmail));
            console.log("Role updated to admin.");
        } else {
            console.log("Admin already has correct role.");
        }
    }
    process.exit(0);
}

setupAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});

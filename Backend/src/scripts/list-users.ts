import db from "../config/db.ts";
import { users } from "../schema/users-schema.ts";

async function listUsers() {
    const allUsers = await db.select().from(users);
    console.log("Registered Users:");
    allUsers.forEach(u => {
        console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`);
    });
    process.exit(0);
}

listUsers();

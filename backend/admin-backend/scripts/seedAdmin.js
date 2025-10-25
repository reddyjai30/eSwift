import bcrypt from "bcryptjs";
import { connectMongo } from "../src/config/mongo.js";
import { Admin } from "../src/models/Admin.js";

(async () => {
  await connectMongo();
  const username = process.argv[2] || "admin";
  const password = process.argv[3] || "Admin@123";
  const passwordHash = await bcrypt.hash(password, 10);
  const doc = await Admin.findOneAndUpdate(
    { username },
    { $set: { passwordHash, isActive: true } },
    { upsert: true, new: true }
  );
  console.log("Seeded admin:", { username, id: doc.id });
  process.exit(0);
})();


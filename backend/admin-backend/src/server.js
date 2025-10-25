import { env } from "./config/env.js";
import { connectMongo } from "./config/mongo.js";
import app from "./app.js";

(async () => {
  await connectMongo();
  app.listen(env.port, () => {
    console.log(`Admin API on http://localhost:${env.port}`);
  });
})();


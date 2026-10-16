import admin from "firebase-admin";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const serviceAccount = require("../serviceAccountKey.json");

const app =
  admin.apps.length > 0
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

export { admin, app };
export default app;
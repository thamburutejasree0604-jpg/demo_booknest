import admin from "firebase-admin";
import dotenv from "dotenv";
import { Buffer } from "buffer";

// load .env variables
dotenv.config();

// decode the service account key
const serviceAccountKey = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString(
    "utf8"
  )
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
  });
}

export default admin;
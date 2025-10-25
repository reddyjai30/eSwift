import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5001),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "2d",
  awsRegion: process.env.AWS_REGION || "ap-south-1",
  awsKey: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecret: process.env.AWS_SECRET_ACCESS_KEY || "",
  s3Bucket: process.env.S3_BUCKET || "",
  s3PresignExpires: Number(process.env.S3_PRESIGN_EXPIRES || 300),
};
if (!env.mongoUri) throw new Error("MONGO_URI missing");
if (!env.jwtSecret) throw new Error("JWT_SECRET missing");
if (!env.s3Bucket) console.warn("S3_BUCKET not set - image upload presign will fail until set.");


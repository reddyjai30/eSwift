import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env.js";
import path from "node:path";
import crypto from "node:crypto";

export const s3Client = new S3Client({
  region: env.awsRegion,
  credentials: {
    accessKeyId: env.awsKey,
    secretAccessKey: env.awsSecret,
  },
});

export function s3PublicUrl(key) {
  return `https://${env.s3Bucket}.s3.${env.awsRegion}.amazonaws.com/${key}`;
}

function fileExt({ filename, contentType }) {
  let ext = filename ? path.extname(filename) : "";
  if (!ext && contentType) {
    const map = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "image/svg+xml": ".svg",
      "application/pdf": ".pdf",
    };
    ext = map[contentType] || "";
  }
  return ext || "";
}

export function buildScopedKey({ scope = "misc", restaurantId, menuItemId, filename, contentType }) {
  const ts = Date.now();
  const rand = crypto.randomBytes(6).toString("hex");
  const ext = fileExt({ filename, contentType }) || ".bin";
  const base = "admin/images";
  switch (scope) {
    case "restaurantLogo":
      if (!restaurantId) throw new Error("restaurantId required for restaurantLogo scope");
      return `${base}/restaurants/${restaurantId}/logo/${ts}-${rand}${ext}`;
    case "menuItemImage":
      if (!restaurantId) throw new Error("restaurantId required for menuItemImage scope");
      return `${base}/restaurants/${restaurantId}/menu/${menuItemId || "new"}/${ts}-${rand}${ext}`;
    default:
      return `${base}/misc/${ts}-${rand}${ext}`;
  }
}

export async function getPresignedUploadUrl(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: env.s3Bucket,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: env.s3PresignExpires });
  const publicUrl = s3PublicUrl(key);
  return { uploadUrl: url, publicUrl };
}

export async function deleteObjectByKey(key) {
  if (!key || typeof key !== "string") throw new Error("key required");
  // simple guard: only allow deleting keys under our admin/images prefix
  if (!key.startsWith("admin/images/")) throw new Error("deletion restricted to admin/images prefix");
  const cmd = new DeleteObjectCommand({ Bucket: env.s3Bucket, Key: key });
  await s3Client.send(cmd);
  return true;
}

export async function putObjectBuffer({ key, contentType, body, acl = "public-read" }) {
  const command = new PutObjectCommand({
    Bucket: env.s3Bucket,
    Key: key,
    ContentType: contentType,
    ACL: acl,
    Body: body,
  });
  await s3Client.send(command);
  return { key, url: s3PublicUrl(key) };
}

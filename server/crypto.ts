import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const SECRET = process.env.SESSION_SECRET || "default-encryption-key-change-me";

function getKey(): Buffer {
  return crypto.createHash("sha256").update(SECRET).digest();
}

export function encryptField(text: string): string;
export function encryptField(text: string | null | undefined): string | null;
export function encryptField(text: string | null | undefined): string | null {
  if (!text) return text as string | null;
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch {
    return text;
  }
}

export function decryptField(encrypted: string): string;
export function decryptField(encrypted: string | null | undefined): string | null;
export function decryptField(encrypted: string | null | undefined): string | null {
  if (!encrypted || !encrypted.includes(":")) return encrypted as string | null;
  try {
    const [ivHex, encryptedText] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    return encrypted;
  }
}

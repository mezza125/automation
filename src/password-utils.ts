import { createHash } from "crypto";

export const getEncryptedPassword = () => {
  const password = process.env.PASSWORD || "password";

  const encryptedSha256 = createHash("sha256").update(password).digest("hex");

  return encryptedSha256;
};

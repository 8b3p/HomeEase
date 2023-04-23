import CryptoJS from "crypto-js";

export const generateSalt = (): string => {
  // Generate salt
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
};

export const hashPassword = (
  password: string,
  salt?: string
): { hashedPassword: string; salt: string } => {
  // Hash password with salt
  salt = salt || generateSalt();
  return {
    hashedPassword: CryptoJS.HmacSHA256(password, salt).toString(),
    salt,
  };
};

export const verifyPassword = ({
  password,
  salt,
  hashedPassword,
}: {
  password: string;
  salt: string;
  hashedPassword: string;
}): boolean => {
  // Verify password with salt
  const newHashedPassword = hashPassword(password, salt).hashedPassword;
  return newHashedPassword === hashedPassword;
};

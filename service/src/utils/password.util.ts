import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
    try {
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS || 10));
      const passwordHash = await bcrypt.hash(password, salt);
      return passwordHash;
    } catch (error: any) {
      console.log(error.message);
      return "";
    }
}

export const validatePassword = async (passwordHash: string, password: string) => {
    return await bcrypt.compare(password, passwordHash);
}
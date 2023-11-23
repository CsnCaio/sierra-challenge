import * as bcrypt from 'bcrypt';

export class SecurityUtil {
  public static async hash(dirtyPassword: string): Promise<string> {
    const saltOrRounds = +process.env.BCRYPT_ROUNDS;
    return bcrypt.hash(dirtyPassword, saltOrRounds);
  }

  public static async compare(dirtyPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(dirtyPassword, password);
  }
}

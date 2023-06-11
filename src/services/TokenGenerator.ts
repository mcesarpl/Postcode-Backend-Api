import { randomBytes } from 'crypto';

class TokenGenerator {
  public generateToken(length = 12): string {
    return randomBytes(length).toString('hex');
  }
}

export const tokenGenerator = new TokenGenerator();

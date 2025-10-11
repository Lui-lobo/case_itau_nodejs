// Importando modulos comuns do nestJs
import { Injectable } from '@nestjs/common';
// Importando modulso de criptografia
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly AES_ALGORITHM = 'aes-256-cbc';
  private readonly AES_SECRET = process.env.AES_SECRET || 'default-crypto-secret-32b';
  private readonly IV_LENGTH = 16;

  // --- Hashing de senhas ---
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // --- Criptografia simétrica (AES) ---
  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      this.AES_ALGORITHM,
      Buffer.from(this.AES_SECRET),
      iv,
    );
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(text: string): string {
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(
      this.AES_ALGORITHM,
      Buffer.from(this.AES_SECRET),
      iv,
    );
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString('utf8');
  }

  // --- HMAC (assinatura de payloads) ---
  signHMAC(data: string): string {
    return crypto.createHmac('sha256', this.AES_SECRET).update(data).digest('hex');
  }
}

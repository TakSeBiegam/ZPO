import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, password: string, name?: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, role: true, name: true },
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;
    return { id: user.id, email: user.email, role: user.role, name: user.name };
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, name: true },
    });
  }

  async registerOAuth(email: string, name?: string, provider?: string, providerId?: string) {
    // Check if user already exists
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { id: existing.id, email: existing.email, role: existing.role, name: existing.name };
    }

    // Create new user with random password (OAuth users don't need it)
    const randomPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await bcrypt.hash(randomPassword, 10);
    
    return this.prisma.user.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, role: true, name: true },
    });
  }
}

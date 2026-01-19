import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: number, data: { name?: string; addressLine?: string; city?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, role: true, name: true, addressLine: true, city: true },
    });
  }

  async getUserTheme(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { theme: true }
    });
    
    if (user?.theme) {
      return user.theme;
    }
    
    // Return default theme if user has none selected
    return this.prisma.theme.findFirst({
      where: { isDefault: true }
    });
  }
}

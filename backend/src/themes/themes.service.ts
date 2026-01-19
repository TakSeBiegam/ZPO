import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ThemesService {
  constructor(private prisma: PrismaService) {}

  async getAllThemes() {
    return this.prisma.theme.findMany({
      orderBy: { isDefault: 'desc' }
    });
  }

  async getTheme(id: number) {
    return this.prisma.theme.findUnique({ where: { id } });
  }

  async createTheme(data: { name: string; colorPrimary: string; colorSecondary: string; colorAccent: string; isDefault?: boolean }) {
    // If this is set as default, unset all other defaults
    if (data.isDefault) {
      await this.prisma.theme.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }
    
    return this.prisma.theme.create({
      data: {
        name: data.name,
        colorPrimary: data.colorPrimary,
        colorSecondary: data.colorSecondary,
        colorAccent: data.colorAccent,
        isDefault: data.isDefault ?? false
      }
    });
  }

  async updateTheme(id: number, data: { name?: string; colorPrimary?: string; colorSecondary?: string; colorAccent?: string; isDefault?: boolean }) {
    // If setting this as default, unset all other defaults
    if (data.isDefault) {
      await this.prisma.theme.updateMany({
        where: { isDefault: true, NOT: { id } },
        data: { isDefault: false }
      });
    }
    
    return this.prisma.theme.update({
      where: { id },
      data
    });
  }

  async deleteTheme(id: number) {
    // Don't allow deleting if users are using this theme
    const usersWithTheme = await this.prisma.user.count({
      where: { themeId: id }
    });
    
    if (usersWithTheme > 0) {
      throw new Error('Cannot delete theme that is in use by users');
    }
    
    return this.prisma.theme.delete({ where: { id } });
  }

  async selectThemeForUser(userId: number, themeId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { themeId }
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

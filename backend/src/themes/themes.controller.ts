import { Controller, Get, Post, Patch, Delete, Body, Param, Session, HttpException, HttpStatus } from '@nestjs/common';
import { ThemesService } from './themes.service';

@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  async getAllThemes() {
    return this.themesService.getAllThemes();
  }

  @Get(':id')
  async getTheme(@Param('id') id: string) {
    const theme = await this.themesService.getTheme(parseInt(id));
    if (!theme) {
      throw new HttpException('Theme not found', HttpStatus.NOT_FOUND);
    }
    return theme;
  }

  @Post()
  async createTheme(
    @Body() data: { name: string; colorPrimary: string; colorSecondary: string; colorAccent: string; isDefault?: boolean },
    @Session() session: any
  ) {
    if (!session.userId || session.role !== 'ADMIN') {
      throw new HttpException('Only admins can create themes', HttpStatus.FORBIDDEN);
    }
    return this.themesService.createTheme(data);
  }

  @Patch(':id')
  async updateTheme(
    @Param('id') id: string,
    @Body() data: { name?: string; colorPrimary?: string; colorSecondary?: string; colorAccent?: string; isDefault?: boolean },
    @Session() session: any
  ) {
    if (!session.userId || session.role !== 'ADMIN') {
      throw new HttpException('Only admins can update themes', HttpStatus.FORBIDDEN);
    }
    return this.themesService.updateTheme(parseInt(id), data);
  }

  @Delete(':id')
  async deleteTheme(
    @Param('id') id: string,
    @Session() session: any
  ) {
    if (!session.userId || session.role !== 'ADMIN') {
      throw new HttpException('Only admins can delete themes', HttpStatus.FORBIDDEN);
    }
    return this.themesService.deleteTheme(parseInt(id));
  }

  @Patch('user/select/:themeId')
  async selectTheme(
    @Param('themeId') themeId: string,
    @Session() session: any
  ) {
    if (!session.userId) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }
    return this.themesService.selectThemeForUser(session.userId, parseInt(themeId));
  }
}

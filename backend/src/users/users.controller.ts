import { Body, Controller, Get, Patch, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Patch('me')
  async updateMe(
    @Body() body: { name?: string; addressLine?: string; city?: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const user = await this.users.updateProfile(userId, body);
    res.json(user);
  }

  @Get('me/theme')
  async getMyTheme(@Req() req: Request, @Res() res: Response) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const theme = await this.users.getUserTheme(userId);
    res.json(theme);
  }
}

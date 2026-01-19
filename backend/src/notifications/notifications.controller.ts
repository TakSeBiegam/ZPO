import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Request, Response } from 'express';

@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  async list(@Query('page') page = '1', @Req() req: Request, @Res() res: Response) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const items = await this.notifications.list(userId, Number(page));
    res.json(items);
  }
}

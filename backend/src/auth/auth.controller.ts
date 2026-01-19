import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name?: string },
    @Res() res: Response,
  ) {
    const user = await this.auth.register(body.email, body.password, body.name);
    res.json(user);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.auth.validateUser(body.email, body.password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    (req.session as any).userId = user.id;
    (req.session as any).role = user.role;
    res.json(user);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const user = await this.auth.getUserById(userId);
    res.json(user);
  }

  @Post('oauth-register')
  async oauthRegister(
    @Body() body: { email: string; name?: string; provider: string; providerId: string },
    @Res() res: Response,
  ) {
    const user = await this.auth.registerOAuth(body.email, body.name, body.provider, body.providerId);
    res.json(user);
  }
}

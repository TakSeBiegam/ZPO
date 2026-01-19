import { Body, Controller, Get, Patch, Post, Req, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { Request, Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private cart: CartService) {}

  @Get()
  async getCart(@Req() req: Request, @Res() res: Response) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const cart = await this.cart.getOrCreateCart(userId);
    res.json(cart);
  }

  @Post('items')
  async addItem(@Body() body: { productId: number; quantity?: number }, @Req() req: Request, @Res() res: Response) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const item = await this.cart.addItem(userId, body.productId, body.quantity ?? 1);
    res.json(item);
  }

  @Post('orders')
  async createOrder(@Req() req: Request, @Res() res: Response) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const order = await this.cart.createOrder(userId);
    res.json(order);
  }

  @Patch('orders/status')
  async updateOrder(@Body() body: { orderId: number; status: 'PENDING' | 'PAID' | 'CANCELLED' }, @Req() req: Request, @Res() res: Response) {
    const role = (req.session as any)?.role;
    if (role !== 'MODERATOR' && role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const order = await this.cart.updateOrderStatus(body.orderId, body.status);
    res.json(order);
  }

  @Get('orders')
  async listOrders(@Req() req: Request, @Res() res: Response) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const orders = await this.cart.listOrders(userId);
    res.json(orders);
  }
}

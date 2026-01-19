import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId }, include: { items: { include: { product: true } } } });
    }
    return cart;
  }

  async addItem(userId: number, productId: number, quantity = 1) {
    const cart = await this.getOrCreateCart(userId);
    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }
    return this.prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  async createOrder(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const items = await this.prisma.cartItem.findMany({ where: { cartId: cart.id }, include: { product: true } });

    const order = await this.prisma.order.create({
      data: {
        userId,
        addressLine: user?.addressLine,
        city: user?.city,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.product.price,
          })),
        },
      },
      include: { items: true },
    });

    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return order;
  }

  async updateOrderStatus(orderId: number, status: 'PENDING' | 'PAID' | 'CANCELLED') {
    return this.prisma.order.update({ where: { id: orderId }, data: { status } });
  }

  async listOrders(userId: number) {
    return this.prisma.order.findMany({ where: { userId }, include: { items: true } });
  }
}

# Modified on 2026-01-24 15:30:00
# Modified on 2026-01-24 15:30:00

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
        if (!cart) {
            cart = await this.prisma.cart.create({ data: { userId }, include: { items: { include: { product: true } } } });
        }
        return cart;
    }
    async addItem(userId, productId, quantity = 1) {
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
    async createOrder(userId) {
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
    async updateOrderStatus(orderId, status) {
        return this.prisma.order.update({ where: { id: orderId }, data: { status } });
    }
    async listOrders(userId) {
        return this.prisma.order.findMany({ where: { userId }, include: { items: true } });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
#;
Modified;
on;
2026 - 1 - 24;
15;
30;
0;
#;
Modified;
on;
2026 - 1 - 24;
15;
30;
0;

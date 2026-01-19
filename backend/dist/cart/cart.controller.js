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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
let CartController = class CartController {
    constructor(cart) {
        this.cart = cart;
    }
    async getCart(req, res) {
        const userId = req.session?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Not logged in' });
        const cart = await this.cart.getOrCreateCart(userId);
        res.json(cart);
    }
    async addItem(body, req, res) {
        const userId = req.session?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Not logged in' });
        const item = await this.cart.addItem(userId, body.productId, body.quantity ?? 1);
        res.json(item);
    }
    async createOrder(req, res) {
        const userId = req.session?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Not logged in' });
        const order = await this.cart.createOrder(userId);
        res.json(order);
    }
    async updateOrder(body, req, res) {
        const role = req.session?.role;
        if (role !== 'MODERATOR' && role !== 'ADMIN')
            return res.status(403).json({ error: 'Forbidden' });
        const order = await this.cart.updateOrderStatus(body.orderId, body.status);
        res.json(order);
    }
    async listOrders(req, res) {
        const userId = req.session?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Not logged in' });
        const orders = await this.cart.listOrders(userId);
        res.json(orders);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('items'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Patch)('orders/status'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "listOrders", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);

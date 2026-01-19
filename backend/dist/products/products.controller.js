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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
let ProductsController = class ProductsController {
    constructor(products) {
        this.products = products;
    }
    async create(body, req, res) {
        const role = req.session?.role;
        if (role !== 'ADMIN')
            return res.status(403).json({ error: 'Forbidden' });
        const product = await this.products.create(body);
        res.json(product);
    }
    async detail(id, res) {
        const product = await this.products.findById(Number(id));
        if (!product)
            return res.status(404).json({ error: 'Not found' });
        res.json(product);
    }
    async addComment(id, body, req, res) {
        const userId = req.session?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Not logged in' });
        const comment = await this.products.addComment(Number(id), userId, body.content);
        res.json(comment);
    }
    async getComments(id, req, res) {
        const userId = req.session?.userId;
        const comments = await this.products.getComments(Number(id), 'APPROVED', userId);
        res.json(comments);
    }
    async getPendingComments(id, req, res) {
        const role = req.session?.role;
        if (role !== 'ADMIN' && role !== 'MODERATOR') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const comments = await this.products.getComments(Number(id), 'PENDING');
        res.json(comments);
    }
    async approveComment(commentId, req, res) {
        const role = req.session?.role;
        if (role !== 'ADMIN' && role !== 'MODERATOR')
            return res.status(403).json({ error: 'Forbidden' });
        const comment = await this.products.approveComment(Number(commentId));
        res.json(comment);
    }
    async deleteComment(commentId, req, res) {
        const userId = req.session?.userId;
        const role = req.session?.role;
        if (!userId)
            return res.status(401).json({ error: 'Not logged in' });
        // SprawdĹş czy uĹĽytkownik jest autorem komentarza lub adminem/moderatorem
        const comment = await this.products.getCommentById(Number(commentId));
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });
        const isOwner = comment.authorId === userId;
        const isAdmin = role === 'ADMIN' || role === 'MODERATOR';
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        await this.products.deleteComment(Number(commentId));
        res.json({ success: true });
    }
    async list(res) {
        const products = await this.products.list();
        res.json(products);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Get)(':id/comments/pending'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getPendingComments", null);
__decorate([
    (0, common_1.Patch)('comments/:commentId/approve'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "approveComment", null);
__decorate([
    (0, common_1.Delete)('comments/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "list", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
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

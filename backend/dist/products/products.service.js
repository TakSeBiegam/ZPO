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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.product.create({ data });
    }
    async findById(id) {
        return this.prisma.product.findUnique({ where: { id }, include: { category: true } });
    }
    async list() {
        return this.prisma.product.findMany({ include: { category: true } });
    }
    async addComment(productId, authorId, content) {
        return this.prisma.comment.create({
            data: { productId, authorId, content },
        });
    }
    async getComments(productId, status = 'APPROVED', currentUserId) {
        // Jeśli status to APPROVED i mamy userId, pokaż APPROVED + własne PENDING
        if (status === 'APPROVED' && currentUserId) {
            return this.prisma.comment.findMany({
                where: {
                    productId,
                    OR: [
                        { status: 'APPROVED' },
                        { status: 'PENDING', authorId: currentUserId },
                    ],
                },
                include: { author: { select: { id: true, name: true, email: true } } },
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.prisma.comment.findMany({
            where: { productId, status },
            include: { author: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getCommentById(commentId) {
        return this.prisma.comment.findUnique({ where: { id: commentId } });
    }
    async approveComment(commentId) {
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { status: 'APPROVED' },
        });
    }
    async deleteComment(commentId) {
        return this.prisma.comment.delete({ where: { id: commentId } });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);

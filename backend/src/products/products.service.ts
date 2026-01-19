import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; author: string; description: string; year: number; price: number; imageUrl?: string; categoryId?: number }) {
    return this.prisma.product.create({ data });
  }

  async findById(id: number) {
    return this.prisma.product.findUnique({ where: { id }, include: { category: true } });
  }

  async list() {
    return this.prisma.product.findMany({ include: { category: true } });
  }

  async addComment(productId: number, authorId: number, content: string) {
    return this.prisma.comment.create({
      data: { productId, authorId, content },
    });
  }

  async getComments(productId: number, status: 'APPROVED' | 'PENDING' = 'APPROVED', currentUserId?: number) {
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

  async getCommentById(commentId: number) {
    return this.prisma.comment.findUnique({ where: { id: commentId } });
  }

  async approveComment(commentId: number) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { status: 'APPROVED' },
    });
  }

  async deleteComment(commentId: number) {
    return this.prisma.comment.delete({ where: { id: commentId } });
  }
}

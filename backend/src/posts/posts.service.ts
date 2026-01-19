import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async createPost(authorId: number, data: { title: string; content: string; categoryId?: number }, userRole?: string) {
    // Admin może od razu tworzyć zatwierdzone posty
    const status = userRole === 'ADMIN' ? 'APPROVED' : 'PENDING';
    return this.prisma.post.create({
      data: { 
        ...data, 
        authorId,
        status,
        approvedById: userRole === 'ADMIN' ? authorId : undefined
      },
    });
  }

  async approvePost(postId: number, moderatorId: number) {
    const post = await this.prisma.post.update({
      where: { id: postId },
      data: { status: 'APPROVED', approvedById: moderatorId },
    });
    await this.notifications.create(post.authorId, 'Twój post został zaakceptowany.');
    return post;
  }

  async listPosts(status: 'APPROVED' | 'PENDING') {
    return this.prisma.post.findMany({
      where: { status },
      include: { category: true, author: true },
    });
  }

  async createCategory(name: string) {
    return this.prisma.category.create({ data: { name } });
  }

  async assignModeratorCategory(moderatorId: number, categoryId: number) {
    await this.prisma.user.update({
      where: { id: moderatorId },
      data: { role: 'MODERATOR' },
    });
    return this.prisma.moderatorCategory.create({
      data: { userId: moderatorId, categoryId },
    });
  }

  async createPostComment(postId: number, authorId: number, content: string) {
    return this.prisma.postComment.create({
      data: { postId, authorId, content },
    });
  }

  async listPostComments(postId: number, status: 'APPROVED' | 'PENDING') {
    return this.prisma.postComment.findMany({
      where: { postId, status },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approvePostComment(commentId: number) {
    return this.prisma.postComment.update({
      where: { id: commentId },
      data: { status: 'APPROVED' },
    });
  }

  async deletePostComment(commentId: number) {
    return this.prisma.postComment.delete({
      where: { id: commentId },
    });
  }
}

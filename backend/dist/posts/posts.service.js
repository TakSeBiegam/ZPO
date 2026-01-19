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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let PostsService = class PostsService {
    constructor(prisma, notifications) {
        this.prisma = prisma;
        this.notifications = notifications;
    }
    async createPost(authorId, data, userRole) {
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
    async approvePost(postId, moderatorId) {
        const post = await this.prisma.post.update({
            where: { id: postId },
            data: { status: 'APPROVED', approvedById: moderatorId },
        });
        await this.notifications.create(post.authorId, 'Twój post został zaakceptowany.');
        return post;
    }
    async listPosts(status) {
        return this.prisma.post.findMany({
            where: { status },
            include: { category: true, author: true },
        });
    }
    async createCategory(name) {
        return this.prisma.category.create({ data: { name } });
    }
    async assignModeratorCategory(moderatorId, categoryId) {
        await this.prisma.user.update({
            where: { id: moderatorId },
            data: { role: 'MODERATOR' },
        });
        return this.prisma.moderatorCategory.create({
            data: { userId: moderatorId, categoryId },
        });
    }
    async createPostComment(postId, authorId, content) {
        return this.prisma.postComment.create({
            data: { postId, authorId, content },
        });
    }
    async listPostComments(postId, status) {
        return this.prisma.postComment.findMany({
            where: { postId, status },
            include: { author: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async approvePostComment(commentId) {
        return this.prisma.postComment.update({
            where: { id: commentId },
            data: { status: 'APPROVED' },
        });
    }
    async deletePostComment(commentId) {
        return this.prisma.postComment.delete({
            where: { id: commentId },
        });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], PostsService);

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
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const posts_service_1 = require("./posts.service");
let PostsController = class PostsController {
    constructor(posts) {
        this.posts = posts;
    }
    async createPost(body, req, res) {
        const userId = req.session?.userId;
        const userRole = req.session?.role;
        if (!userId)
            return res.status(401).json({ error: 'Not logged in' });
        const post = await this.posts.createPost(userId, body, userRole);
        res.json(post);
    }
    async approvePost(id, req, res) {
        const role = req.session?.role;
        if (role !== 'MODERATOR' && role !== 'ADMIN')
            return res.status(403).json({ error: 'Forbidden' });
        const post = await this.posts.approvePost(Number(id), req.session.userId);
        res.json(post);
    }
    async list(status = 'APPROVED', res) {
        const posts = await this.posts.listPosts(status);
        res.json(posts);
    }
    async createCategory(body, req, res) {
        const role = req.session?.role;
        if (role !== 'ADMIN')
            return res.status(403).json({ error: 'Forbidden' });
        const category = await this.posts.createCategory(body.name);
        res.json(category);
    }
    async assignModerator(body, req, res) {
        const role = req.session?.role;
        if (role !== 'ADMIN')
            return res.status(403).json({ error: 'Forbidden' });
        const mapping = await this.posts.assignModeratorCategory(body.moderatorId, body.categoryId);
        res.json(mapping);
    }
    async createComment(postId, body, req, res) {
        const userId = req.session?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Not logged in' });
        const comment = await this.posts.createPostComment(Number(postId), userId, body.content);
        res.json(comment);
    }
    async listComments(postId, status = 'APPROVED', res) {
        const comments = await this.posts.listPostComments(Number(postId), status);
        res.json(comments);
    }
    async approveComment(id, req, res) {
        const role = req.session?.role;
        if (role !== 'MODERATOR' && role !== 'ADMIN')
            return res.status(403).json({ error: 'Forbidden' });
        const comment = await this.posts.approvePostComment(Number(id));
        res.json(comment);
    }
    async deleteComment(id, req, res) {
        const role = req.session?.role;
        if (role !== 'MODERATOR' && role !== 'ADMIN')
            return res.status(403).json({ error: 'Forbidden' });
        await this.posts.deletePostComment(Number(id));
        res.json({ ok: true });
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "approvePost", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Post)('assign'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "assignModerator", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "listComments", null);
__decorate([
    (0, common_1.Patch)('comments/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "approveComment", null);
__decorate([
    (0, common_1.Delete)('comments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deleteComment", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsController);
#;
Modified;
on;
2026 - 1 - 25;
17;
10;
0;
#;
Modified;
on;
2026 - 1 - 25;
17;
10;
0;

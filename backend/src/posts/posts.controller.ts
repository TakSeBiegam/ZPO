import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Request, Response } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService) {}

  @Post()
  async createPost(
    @Body() body: { title: string; content: string; categoryId?: number },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req.session as any)?.userId;
    const userRole = (req.session as any)?.role;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const post = await this.posts.createPost(userId, body, userRole);
    res.json(post);
  }

  @Patch(':id/approve')
  async approvePost(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const role = (req.session as any)?.role;
    if (role !== 'MODERATOR' && role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const post = await this.posts.approvePost(Number(id), (req.session as any).userId);
    res.json(post);
  }

  @Get()
  async list(@Query('status') status = 'APPROVED', @Res() res: Response) {
    const posts = await this.posts.listPosts(status as 'APPROVED' | 'PENDING');
    res.json(posts);
  }

  @Post('categories')
  async createCategory(@Body() body: { name: string }, @Req() req: Request, @Res() res: Response) {
    const role = (req.session as any)?.role;
    if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const category = await this.posts.createCategory(body.name);
    res.json(category);
  }

  @Post('assign')
  async assignModerator(
    @Body() body: { moderatorId: number; categoryId: number },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const role = (req.session as any)?.role;
    if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const mapping = await this.posts.assignModeratorCategory(body.moderatorId, body.categoryId);
    res.json(mapping);
  }

  @Post(':id/comments')
  async createComment(
    @Param('id') postId: string,
    @Body() body: { content: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const comment = await this.posts.createPostComment(Number(postId), userId, body.content);
    res.json(comment);
  }

  @Get(':id/comments')
  async listComments(
    @Param('id') postId: string,
    @Query('status') status = 'APPROVED',
    @Res() res: Response,
  ) {
    const comments = await this.posts.listPostComments(Number(postId), status as 'APPROVED' | 'PENDING');
    res.json(comments);
  }

  @Patch('comments/:id/approve')
  async approveComment(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const role = (req.session as any)?.role;
    if (role !== 'MODERATOR' && role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const comment = await this.posts.approvePostComment(Number(id));
    res.json(comment);
  }

  @Delete('comments/:id')
  async deleteComment(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const role = (req.session as any)?.role;
    if (role !== 'MODERATOR' && role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    await this.posts.deletePostComment(Number(id));
    res.json({ ok: true });
  }
}

# Modified on 2026-01-25 17:10:00
# Modified on 2026-01-25 17:10:00
# Modified on 2026-01-25 17:10:00

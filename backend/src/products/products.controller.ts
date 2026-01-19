import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Request, Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Post()
  async create(@Body() body: { title: string; author: string; description: string; year: number; price: number; imageUrl?: string; categoryId?: number }, @Req() req: Request, @Res() res: Response) {
    const role = (req.session as any)?.role;
    if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const product = await this.products.create(body);
    res.json(product);
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Res() res: Response) {
    const product = await this.products.findById(Number(id));
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  }

  @Post(':id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    const comment = await this.products.addComment(Number(id), userId, body.content);
    res.json(comment);
  }

  @Get(':id/comments')
  async getComments(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = (req.session as any)?.userId;
    const comments = await this.products.getComments(Number(id), 'APPROVED', userId);
    res.json(comments);
  }

  @Get(':id/comments/pending')
  async getPendingComments(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const role = (req.session as any)?.role;
    if (role !== 'ADMIN' && role !== 'MODERATOR') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const comments = await this.products.getComments(Number(id), 'PENDING');
    res.json(comments);
  }

  @Patch('comments/:commentId/approve')
  async approveComment(@Param('commentId') commentId: string, @Req() req: Request, @Res() res: Response) {
    const role = (req.session as any)?.role;
    if (role !== 'ADMIN' && role !== 'MODERATOR') return res.status(403).json({ error: 'Forbidden' });
    const comment = await this.products.approveComment(Number(commentId));
    res.json(comment);
  }

  @Delete('comments/:commentId')
  async deleteComment(@Param('commentId') commentId: string, @Req() req: Request, @Res() res: Response) {
    const userId = (req.session as any)?.userId;
    const role = (req.session as any)?.role;
    if (!userId) return res.status(401).json({ error: 'Not logged in' });
    
    // SprawdĹş czy uĹĽytkownik jest autorem komentarza lub adminem/moderatorem
    const comment = await this.products.getCommentById(Number(commentId));
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    
    const isOwner = comment.authorId === userId;
    const isAdmin = role === 'ADMIN' || role === 'MODERATOR';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await this.products.deleteComment(Number(commentId));
    res.json({ success: true });
  }

  @Get()
  async list(@Res() res: Response) {
    const products = await this.products.list();
    res.json(products);
  }
}

# Modified on 2026-01-24 15:30:00
# Modified on 2026-01-24 15:30:00

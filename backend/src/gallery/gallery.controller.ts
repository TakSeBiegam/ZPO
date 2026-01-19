import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { Request, Response } from 'express';

@Controller('gallery')
export class GalleryController {
  constructor(private gallery: GalleryService) {}

  @Post('images')
  async addImage(@Body() body: { title: string; description: string; url: string }, @Res() res: Response) {
    const image = await this.gallery.addImage(body);
    res.json(image);
  }

  @Get('images')
  async listImages(@Res() res: Response) {
    const images = await this.gallery.listImages();
    res.json(images);
  }

  @Post('slider')
  async addToSlider(@Body() body: { imageId: number }, @Req() req: Request, @Res() res: Response) {
    const role = (req.session as any)?.role;
    if (role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const item = await this.gallery.addToSlider(body.imageId);
    res.json(item);
  }

  @Get('slider')
  async listSlider(@Res() res: Response) {
    const items = await this.gallery.listSlider();
    res.json(items);
  }
}

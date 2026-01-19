import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  async addImage(data: { title: string; description: string; url: string }) {
    return this.prisma.galleryImage.create({ data });
  }

  async listImages() {
    return this.prisma.galleryImage.findMany();
  }

  async addToSlider(imageId: number) {
    const count = await this.prisma.sliderItem.count();
    return this.prisma.sliderItem.create({ data: { imageId, order: count } });
  }

  async listSlider() {
    return this.prisma.sliderItem.findMany({ include: { image: true }, orderBy: { order: 'asc' } });
  }
}

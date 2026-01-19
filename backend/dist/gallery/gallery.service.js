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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GalleryService = class GalleryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addImage(data) {
        return this.prisma.galleryImage.create({ data });
    }
    async listImages() {
        return this.prisma.galleryImage.findMany();
    }
    async addToSlider(imageId) {
        const count = await this.prisma.sliderItem.count();
        return this.prisma.sliderItem.create({ data: { imageId, order: count } });
    }
    async listSlider() {
        return this.prisma.sliderItem.findMany({ include: { image: true }, orderBy: { order: 'asc' } });
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GalleryService);

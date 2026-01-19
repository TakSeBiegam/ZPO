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
exports.GalleryController = void 0;
const common_1 = require("@nestjs/common");
const gallery_service_1 = require("./gallery.service");
let GalleryController = class GalleryController {
    constructor(gallery) {
        this.gallery = gallery;
    }
    async addImage(body, res) {
        const image = await this.gallery.addImage(body);
        res.json(image);
    }
    async listImages(res) {
        const images = await this.gallery.listImages();
        res.json(images);
    }
    async addToSlider(body, req, res) {
        const role = req.session?.role;
        if (role !== 'ADMIN')
            return res.status(403).json({ error: 'Forbidden' });
        const item = await this.gallery.addToSlider(body.imageId);
        res.json(item);
    }
    async listSlider(res) {
        const items = await this.gallery.listSlider();
        res.json(items);
    }
};
exports.GalleryController = GalleryController;
__decorate([
    (0, common_1.Post)('images'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "addImage", null);
__decorate([
    (0, common_1.Get)('images'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "listImages", null);
__decorate([
    (0, common_1.Post)('slider'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "addToSlider", null);
__decorate([
    (0, common_1.Get)('slider'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "listSlider", null);
exports.GalleryController = GalleryController = __decorate([
    (0, common_1.Controller)('gallery'),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], GalleryController);

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
exports.ThemesController = void 0;
const common_1 = require("@nestjs/common");
const themes_service_1 = require("./themes.service");
let ThemesController = class ThemesController {
    constructor(themesService) {
        this.themesService = themesService;
    }
    async getAllThemes() {
        return this.themesService.getAllThemes();
    }
    async getTheme(id) {
        const theme = await this.themesService.getTheme(parseInt(id));
        if (!theme) {
            throw new common_1.HttpException('Theme not found', common_1.HttpStatus.NOT_FOUND);
        }
        return theme;
    }
    async createTheme(data, session) {
        if (!session.userId || session.role !== 'ADMIN') {
            throw new common_1.HttpException('Only admins can create themes', common_1.HttpStatus.FORBIDDEN);
        }
        return this.themesService.createTheme(data);
    }
    async updateTheme(id, data, session) {
        if (!session.userId || session.role !== 'ADMIN') {
            throw new common_1.HttpException('Only admins can update themes', common_1.HttpStatus.FORBIDDEN);
        }
        return this.themesService.updateTheme(parseInt(id), data);
    }
    async deleteTheme(id, session) {
        if (!session.userId || session.role !== 'ADMIN') {
            throw new common_1.HttpException('Only admins can delete themes', common_1.HttpStatus.FORBIDDEN);
        }
        return this.themesService.deleteTheme(parseInt(id));
    }
    async selectTheme(themeId, session) {
        if (!session.userId) {
            throw new common_1.HttpException('Not authenticated', common_1.HttpStatus.UNAUTHORIZED);
        }
        return this.themesService.selectThemeForUser(session.userId, parseInt(themeId));
    }
};
exports.ThemesController = ThemesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "getAllThemes", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "getTheme", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "createTheme", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "updateTheme", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "deleteTheme", null);
__decorate([
    (0, common_1.Patch)('user/select/:themeId'),
    __param(0, (0, common_1.Param)('themeId')),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ThemesController.prototype, "selectTheme", null);
exports.ThemesController = ThemesController = __decorate([
    (0, common_1.Controller)('themes'),
    __metadata("design:paramtypes", [themes_service_1.ThemesService])
], ThemesController);

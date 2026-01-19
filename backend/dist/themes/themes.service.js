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
exports.ThemesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ThemesService = class ThemesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllThemes() {
        return this.prisma.theme.findMany({
            orderBy: { isDefault: 'desc' }
        });
    }
    async getTheme(id) {
        return this.prisma.theme.findUnique({ where: { id } });
    }
    async createTheme(data) {
        // If this is set as default, unset all other defaults
        if (data.isDefault) {
            await this.prisma.theme.updateMany({
                where: { isDefault: true },
                data: { isDefault: false }
            });
        }
        return this.prisma.theme.create({
            data: {
                name: data.name,
                colorPrimary: data.colorPrimary,
                colorSecondary: data.colorSecondary,
                colorAccent: data.colorAccent,
                isDefault: data.isDefault ?? false
            }
        });
    }
    async updateTheme(id, data) {
        // If setting this as default, unset all other defaults
        if (data.isDefault) {
            await this.prisma.theme.updateMany({
                where: { isDefault: true, NOT: { id } },
                data: { isDefault: false }
            });
        }
        return this.prisma.theme.update({
            where: { id },
            data
        });
    }
    async deleteTheme(id) {
        // Don't allow deleting if users are using this theme
        const usersWithTheme = await this.prisma.user.count({
            where: { themeId: id }
        });
        if (usersWithTheme > 0) {
            throw new Error('Cannot delete theme that is in use by users');
        }
        return this.prisma.theme.delete({ where: { id } });
    }
    async selectThemeForUser(userId, themeId) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { themeId }
        });
    }
    async getUserTheme(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { theme: true }
        });
        if (user?.theme) {
            return user.theme;
        }
        // Return default theme if user has none selected
        return this.prisma.theme.findFirst({
            where: { isDefault: true }
        });
    }
};
exports.ThemesService = ThemesService;
exports.ThemesService = ThemesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ThemesService);

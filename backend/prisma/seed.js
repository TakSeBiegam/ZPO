"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const moderatorPassword = await bcrypt.hash('Mod123!', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@bookstore.local' },
        update: { role: 'ADMIN', passwordHash: adminPassword, name: 'Admin' },
        create: { email: 'admin@bookstore.local', passwordHash: adminPassword, role: 'ADMIN', name: 'Admin' },
    });
    const moderator = await prisma.user.upsert({
        where: { email: 'moderator@bookstore.local' },
        update: { role: 'MODERATOR', passwordHash: moderatorPassword, name: 'Moderator' },
        create: { email: 'moderator@bookstore.local', passwordHash: moderatorPassword, role: 'MODERATOR', name: 'Moderator' },
    });
    const fiction = await prisma.category.upsert({
        where: { name: 'Fiction' },
        update: {},
        create: { name: 'Fiction' },
    });
    const science = await prisma.category.upsert({
        where: { name: 'Science' },
        update: {},
        create: { name: 'Science' },
    });
    const mappings = [
        { userId: moderator.id, categoryId: fiction.id },
        { userId: moderator.id, categoryId: science.id },
    ];
    for (const mapping of mappings) {
        const exists = await prisma.moderatorCategory.findFirst({ where: mapping });
        if (!exists) {
            await prisma.moderatorCategory.create({ data: mapping });
        }
    }
    const products = [
        { title: 'Cień wiatru', description: 'Powieść o tajemnicy książek.', price: 4999, categoryId: fiction.id },
        { title: 'Wiedza wszechświata', description: 'Popularnonaukowa podróż po kosmosie.', price: 5999, categoryId: science.id },
        { title: 'Minimalizm w życiu', description: 'Poradnik o prostocie.', price: 3999, categoryId: fiction.id },
    ];
    for (const product of products) {
        const existing = await prisma.product.findFirst({ where: { title: product.title } });
        if (existing) {
            await prisma.product.update({ where: { id: existing.id }, data: product });
        }
        else {
            await prisma.product.create({ data: product });
        }
    }
    const images = [
        {
            title: 'Cień wiatru – okładka',
            description: 'Okładka książki Cień wiatru.',
            url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
        },
        {
            title: 'Wiedza wszechświata – okładka',
            description: 'Okładka książki o kosmosie.',
            url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d',
        },
        {
            title: 'Minimalizm w życiu – okładka',
            description: 'Okładka poradnika o minimalizmie.',
            url: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c',
        },
    ];
    const galleryImages = [];
    for (const image of images) {
        const existing = await prisma.galleryImage.findFirst({ where: { title: image.title } });
        const record = existing
            ? await prisma.galleryImage.update({ where: { id: existing.id }, data: image })
            : await prisma.galleryImage.create({ data: image });
        galleryImages.push({ id: record.id });
    }
    const existingSlider = await prisma.sliderItem.findMany();
    if (existingSlider.length === 0) {
        let order = 0;
        for (const img of galleryImages) {
            await prisma.sliderItem.create({ data: { imageId: img.id, order } });
            order += 1;
        }
    }
    const post = await prisma.post.create({
        data: {
            title: 'Nowy dział w księgarni',
            content: 'Dodaliśmy nowe książki naukowe. Sprawdźcie ofertę!',
            status: 'APPROVED',
            authorId: admin.id,
            categoryId: science.id,
            approvedById: admin.id,
        },
    });
    await prisma.comment.create({
        data: {
            content: 'Świetna wiadomość! Czekam na promocje.',
            status: 'PENDING',
            postId: post.id,
            authorId: moderator.id,
        },
    });
    console.log('Seed completed.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { GalleryModule } from './gallery/gallery.module';
import { CartModule } from './cart/cart.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProductsModule } from './products/products.module';
import { ReflectionModule } from './reflection/reflection.module';
import { ThemesModule } from './themes/themes.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    GalleryModule,
    CartModule,
    NotificationsModule,
    ProductsModule,
    ReflectionModule,
    ThemesModule,
  ],
})
export class AppModule {}

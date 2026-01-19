import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ReflectionService } from './reflection.service';
import { ReflectionController } from './reflection.controller';

@Module({
  imports: [DiscoveryModule],
  providers: [ReflectionService],
  controllers: [ReflectionController],
})
export class ReflectionModule {}

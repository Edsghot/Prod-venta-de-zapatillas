import { Module } from '@nestjs/common';
import { SizeModuleService } from './size-module.service';
import { SizeModuleController } from './size-module.controller';
import { SizeProd } from './Entity/SizeEntity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      TypeOrmModule.forFeature([SizeProd])
    ],
  providers: [SizeModuleService],
  controllers: [SizeModuleController]
})
export class SizeModuleModule {}

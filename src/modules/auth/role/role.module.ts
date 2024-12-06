import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { PrismaModule } from '@common/prisma/prisma.module';
import { RoleRepo } from './role.repo';

@Module({
  imports: [PrismaModule],
  exports: [RoleService],
  providers: [RoleService, RoleRepo],
})
export class RoleModule {}

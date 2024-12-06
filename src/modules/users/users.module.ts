import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '@common/prisma/prisma.module';
import { OrganizationModule } from '../organization';
import { RoleModule } from '../auth/role/role.module';
import { UsersRepo } from './users.repo';

@Module({
  imports: [PrismaModule, OrganizationModule, RoleModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, UsersRepo],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { PrismaModule } from '@common/prisma/prisma.module';
import { OrganizationRepo } from './organization.repo';

@Module({
  imports: [PrismaModule],
  exports: [OrganizationService],
  providers: [OrganizationService, OrganizationRepo],
})
export class OrganizationModule {}

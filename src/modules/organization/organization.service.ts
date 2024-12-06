import { OrganizationRepo } from './organization.repo';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class OrganizationService {
  constructor(private readonly organizationRepo: OrganizationRepo) {}

  async findOrganizationByName(name: string) {
    const organization = await this.organizationRepo.findUnique({
      where: { name },
    });

    if (!organization)
      throw new NotFoundException(`Organization with name: ${name} not found`);

    return organization;
  }
}

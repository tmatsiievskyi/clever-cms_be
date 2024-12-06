import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepo } from './role.repo';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepo) {}

  async findRoleByName(
    name: string,
    organizationId: number,
    include?: Prisma.RoleInclude,
  ) {
    const role = await this.roleRepo.findFirst({
      where: { name, organizationId },
      include,
    });

    if (!role) throw new NotFoundException(`Role with name: ${name} not found`);

    return role;
  }
}

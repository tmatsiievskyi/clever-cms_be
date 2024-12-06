import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { OrganizationService } from '../organization';
import { RoleService } from '../auth/role/role.service';
import { TUserIncludes, UsersRepo } from './users.repo';
import { ServiceCore } from '@common/core';
import { TUser } from '@common/types';

@Injectable()
export class UsersService extends ServiceCore {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly usersRepo: UsersRepo,
  ) {
    super();
  }

  async findById(id: number, include?: TUserIncludes): Promise<TUser | null> {
    const user = await this.usersRepo.findUnique({
      where: { id },
      include,
    });

    return user;
  }

  async findByEmail(
    email: string,
    include?: TUserIncludes,
  ): Promise<TUser | null> {
    return await this.usersRepo.findUnique({
      where: { email },
      include,
    });
  }

  async create(user: CreateUserDto) {
    try {
      const defaultOrganization =
        await this.organizationService.findOrganizationByName('default');

      const defaultRole = await this.roleService.findRoleByName(
        'user',
        defaultOrganization.id,
      );

      const newUser = await this.usersRepo.create({
        data: {
          ...user,
          organization: { connect: { id: defaultOrganization.id } },
          roles: { connect: { id: defaultRole.id } },
        },
      });

      return newUser;
    } catch (error) {
      this.handleError(error);
    }
  }
}

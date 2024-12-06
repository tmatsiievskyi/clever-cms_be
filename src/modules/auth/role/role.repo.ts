import { PrismaService } from '@common/prisma';
import { RepoCore } from '@common/core';
import { TDelegateArgs, TDelegateReturnTypes } from '@common/types';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

type TRoleDelegate = Prisma.RoleDelegate;

@Injectable()
export class RoleRepo extends RepoCore<
  TRoleDelegate,
  TDelegateArgs<TRoleDelegate>,
  TDelegateReturnTypes<TRoleDelegate>
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.role);
  }
}

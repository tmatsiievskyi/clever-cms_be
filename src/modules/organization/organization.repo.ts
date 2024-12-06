import { RepoCore } from '@common/core';
import { PrismaService } from '@common/prisma';
import { TDelegateArgs, TDelegateReturnTypes } from '@common/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type TOrganizationDelegate = Prisma.OrganizationDelegate;

@Injectable()
export class OrganizationRepo extends RepoCore<
  TOrganizationDelegate,
  TDelegateArgs<TOrganizationDelegate>,
  TDelegateReturnTypes<TOrganizationDelegate>
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.organization);
  }
}

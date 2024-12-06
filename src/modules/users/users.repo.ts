import { RepoCore } from '@common/core';
import { PrismaService } from '@common/prisma';
import { TDelegateArgs, TDelegateReturnTypes } from '@common/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type TUserDelegate = Prisma.UserDelegate;
export type TUserIncludes = Prisma.UserInclude;

@Injectable()
export class UsersRepo extends RepoCore<
  TUserDelegate,
  TDelegateArgs<TUserDelegate>,
  TDelegateReturnTypes<TUserDelegate>
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.user);
  }
}

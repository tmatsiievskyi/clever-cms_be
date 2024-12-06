import { RepoCore } from '@common/core';
import { PrismaService } from '@common/prisma';
import { TDelegateArgs, TDelegateReturnTypes } from '@common/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type TRefreshTokenDelegate = Prisma.RefreshTokenDelegate;
export type TRefreshTokenIncludes = Prisma.RefreshTokenInclude;

@Injectable()
export class RefreshTokenRepo extends RepoCore<
  TRefreshTokenDelegate,
  TDelegateArgs<TRefreshTokenDelegate>,
  TDelegateReturnTypes<TRefreshTokenDelegate>
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma.refreshToken);
  }
}

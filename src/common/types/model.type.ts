import {
  User,
  Role,
  Organization,
  Policy,
  Unit,
  RefreshToken,
} from '@prisma/client';

export type TUser = User & { roles?: Role[] } & {
  organization?: Organization;
} & { policies?: Policy[] } & { units?: Unit[] } & {
  refreshToken?: RefreshToken[];
};

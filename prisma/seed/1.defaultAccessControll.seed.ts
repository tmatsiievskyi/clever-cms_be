import { PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  const defaultOrganization = await prisma.organization.upsert({
    where: { name: 'default' },
    update: {},
    create: {
      name: 'default',
      titleName: 'Default Organization',
      address: 'Default Address',
      phone: '1111',
      email: 'default@email.com',
    },
  });

  const userDefaultPolicy = await prisma.policy.create({
    data: {
      name: 'user_read_update_own_data',
      effect: 'allow',
      actions: ['read', 'update'],
      resources: ['UserProfile'],
      conditions: {},
      organization: {
        connect: { id: defaultOrganization.id },
      },
    },
  });

  const userDefaultRole = await prisma.role.create({
    data: {
      name: 'user',
      description: 'Default User Role',
      policies: {
        connect: [{ id: userDefaultPolicy.id }],
      },
      organization: {
        connect: { id: defaultOrganization.id },
      },
    },
  });

  return { userDefaultRole, userDefaultPolicy, defaultOrganization };
}

import { PostgresService } from '@/database/postgres/postgres.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { EPermissionId } from './constants/permissions.const';

@Injectable()
export class PermissionService {
  constructor(private postgresService: PostgresService) {}

  public async getPermissionsOfUser(user_id: number) {
    const users = await this.postgresService.permission.findMany({
      where: { users: { every: { user_id } } },
    });
    return users;
  }

  public async assignPermissionsForUser(
    user_id: User['id'],
    permission_ids: EPermissionId[],
  ) {
    const newUserPermissions = permission_ids.map((permission_id) => ({
      user_id,
      permission_id,
    }));

    const permissions = await this.postgresService.$transaction(async (tx) => {
      await tx.userPermission.createMany({
        data: newUserPermissions,
        skipDuplicates: true,
      });
      const userPermissions = await tx.userPermission.findMany({
        where: { user_id },
        select: { permission: true },
      });
      const permissions = userPermissions.map(({ permission }) => permission);
      return permissions;
    });

    return permissions;
  }
}

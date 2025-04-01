import { PostgresService } from '@/database/postgres/postgres.service';
import { Injectable } from '@nestjs/common';
import { UserDefaultSelect } from './models/user.model';
@Injectable()
export class UserService {
  constructor(private postgresService: PostgresService) {}

  async findUserById(id: number) {
    return this.postgresService.user.findUnique({ where: { id } });
  }

  async findUserByEmail(email: string) {
    return this.postgresService.user.findUnique({ where: { email } });
  }

  async findUserByRefreshToken(refresh_token: string) {
    const user = await this.postgresService.user.findFirst({
      where: { refresh_tokens: { some: { token: refresh_token } } },
      select: { ...UserDefaultSelect, permissions: { select: { permission_id: true } } },
    });
    if (!user) {
      return null;
    }
    return {
      ...user,
      permissions: user.permissions.map((permission) => permission.permission_id),
    };
  }
}

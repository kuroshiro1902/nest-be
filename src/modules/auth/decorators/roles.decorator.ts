import { SetMetadata } from '@nestjs/common';
import { EUserRole } from '@/modules/user/entity/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EUserRole[]) => SetMetadata(ROLES_KEY, roles);

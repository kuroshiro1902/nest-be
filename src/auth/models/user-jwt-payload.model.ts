import { TPermission } from '@/permission/models/permission.model';
import { TUser } from '@/user/models/user.model';

export type TUserJWTPayload = Pick<TUser, 'id'> & { permissions?: TPermission['id'][] };

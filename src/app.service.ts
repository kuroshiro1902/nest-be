import { Injectable } from '@nestjs/common';
import { PostgresService } from './database/postgres/postgres.service';

@Injectable()
export class AppService {
  constructor(private postgresService: PostgresService) {
    this.postgresService.permission
      .findMany({ select: { id: true, created_at: true } })
      .then((permissions) => {
        console.log('Permissions:', permissions);
      })
      .catch((error) => {
        console.error('Error fetching permissions:', error);
      });
  }

  ping() {
    return 'Pong!';
  }
}

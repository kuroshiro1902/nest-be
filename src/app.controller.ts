// import { Controller, Get, Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
// import { ResponseData } from './shared/models/response-data.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('/:id')
  // ping(@Param('id') id: string) {
  //   if (id === 'ping') {
  //     return ResponseData.fail('Pong fail!');
  //   }
  //   return this.appService.ping();
  // }
}

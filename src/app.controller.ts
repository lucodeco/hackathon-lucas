import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { QueryDto } from './dto/query.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async getData(@Body() body: QueryDto): Promise<string> {
    return this.appService.getHello(body.query);
  }
}

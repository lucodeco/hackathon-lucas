import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { QueryDto } from './dto/query.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiOperation({ summary: 'get data that matches the user query' })
  @ApiResponse({
    status: 200,
    description:
      'Successful response. The JSON schema will depend on the user query',
    type: String,
  })
  async getAmplitudeData(@Body() body: QueryDto): Promise<unknown> {
    return this.appService.getAmplitudeData(body.query);
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './db/data-source';
import { UserLog } from './entities/userLog.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    TypeOrmModule.forFeature([UserLog]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

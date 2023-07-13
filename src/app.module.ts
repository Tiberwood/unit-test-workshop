import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokeModule } from './poke/poke.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PokeModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

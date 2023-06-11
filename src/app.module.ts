import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'ConfigService',
      useClass: ConfigService,
    },
    AppService,
  ],
})
export class AppModule {}

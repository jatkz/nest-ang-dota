import { SyncController } from './dota-trends/controllers/sync.controller';
import { DotaConstantsController } from './dota-trends/controllers/dota-constants.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DotaTrendsModule } from './dota-trends/dota-trends.module';
import { AuthModule } from './auth/auth.module';
import { GetUserMiddleware } from './middleware/get-user.middleware';
import { PingController } from './ping.controller';
import * as Joi from 'joi';

export interface ENV_VARIABLES {
  NODE_ENV: 'production' | 'development' | 'test';
  DOTA_MONGO_URI: string;
}

@Module({
  imports: [
    DotaTrendsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('dev')
      }),
      envFilePath: `env/${process.env.NODE_ENV}.env`,
      cache: true
    })
  ],
  controllers: [PingController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(GetUserMiddleware).forRoutes(DotaConstantsController, SyncController);
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy.js';
import { JwtAuthGuard, JwtStrategy } from './jwt.strategy.js';
import { AuthService } from './auth.service.js';
// import { DatabaseService } from '../store/db.service.js';
import { AuthControllers } from './auth.controllers.js';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema.js';


@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async function(configService: ConfigService) {
        return {  secret: configService.get('JWTSECRETKEY'),
          signOptions: { expiresIn: '1d' }
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema}])
  ],
  controllers: [AuthControllers],
  providers: [
    {
      provide: APP_GUARD, 
      useClass: JwtAuthGuard
    }, 
    AuthService, 
    LocalStrategy, 
    JwtStrategy, 
  ],
  exports: [JwtModule]
})
export class AuthModule {}
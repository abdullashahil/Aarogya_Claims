import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(), // Import ConfigModule
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule for JwtModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  providers: [AuthService, JwtStrategy], // Add JwtStrategy to providers
  controllers: [AuthController],
})
export class AuthModule {}
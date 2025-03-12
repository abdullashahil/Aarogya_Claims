import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClaimsModule } from './claims/claims.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forRoot("mongodb+srv://abdullashahil0077:Atlas12@cluster0.50u7uwn.mongodb.net/Aarogya-Claims"),
    AuthModule,
    UsersModule,
    ClaimsModule,
  ],
})
export class AppModule {}
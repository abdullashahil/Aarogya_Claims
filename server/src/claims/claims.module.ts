import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClaimSchema } from './schemas/claim.schema';
import { ClaimsService } from './claims.service';
import { ClaimsController } from './claims.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Claim', schema: ClaimSchema }]),
  ],
  providers: [ClaimsService],
  controllers: [ClaimsController],
})
export class ClaimsModule {}
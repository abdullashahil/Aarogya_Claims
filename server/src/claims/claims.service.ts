import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim } from './schemas/claim.schema';
import { CreateClaimDto } from './dto/create-claim.dto'; 
import { UpdateClaimDto } from './dto/update-claim.dto'; 

@Injectable()
export class ClaimsService {
  constructor(@InjectModel('Claim') private claimModel: Model<Claim>) {}

  async create(createClaimDto: CreateClaimDto): Promise<Claim> {
    const newClaim = new this.claimModel(createClaimDto);
    return newClaim.save();
  }

  async findAll(): Promise<Claim[]> {
    return this.claimModel.find().exec();
  }

  async update(id: string, updateClaimDto: UpdateClaimDto): Promise<Claim> {
    const updatedClaim = await this.claimModel
    .findByIdAndUpdate(id, updateClaimDto, { new: true })
    .exec();
    if (!updatedClaim) {
      throw new NotFoundException('Claim not found');
    }
    return updatedClaim;
  }
}
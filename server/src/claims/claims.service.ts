import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim } from './schemas/claim.schema';

@Injectable()
export class ClaimsService {
  constructor(@InjectModel('Claim') private claimModel: Model<Claim>) {}

  async create(claim: any): Promise<Claim> {
    const newClaim = new this.claimModel(claim);
    return newClaim.save();
  }

  async findAll(): Promise<Claim[]> {
    return this.claimModel.find().exec();
  }

  async update(id: string, updateData: any): Promise<Claim> {
    const updatedClaim = await this.claimModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedClaim) {
      throw new NotFoundException('Claim not found');
    }
    return updatedClaim;
  }
}
import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateClaimDto } from './dto/create-claim.dto'; 
import { UpdateClaimDto } from './dto/update-claim.dto'; 

@Controller('claims')
export class ClaimsController {
  constructor(private claimsService: ClaimsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createClaimDto: CreateClaimDto) {
    return this.claimsService.create(createClaimDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.claimsService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateClaimDto: UpdateClaimDto) {
    return this.claimsService.update(id, updateClaimDto);
  }
}
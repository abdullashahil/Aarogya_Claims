import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ClaimsService } from './claims.service';

@Controller('claims')
export class ClaimsController {
  constructor(private claimsService: ClaimsService) {}

  @Post()
  async create(@Body() claim: any) {
    return this.claimsService.create(claim);
  }

  @Get()
  async findAll() {
    return this.claimsService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.claimsService.update(id, updateData);
  }
}
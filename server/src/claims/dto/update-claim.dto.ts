import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateClaimDto {
  @IsOptional()
  @IsString()
  readonly status?: string;

  @IsOptional()
  @IsNumber()
  readonly approvedAmount?: number;

  @IsOptional()
  @IsString()
  readonly insurerComments?: string;
}
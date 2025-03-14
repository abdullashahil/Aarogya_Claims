import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class CreateClaimDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly claimAmount: number;

  @IsString()
  readonly documentUrl: string;

  @IsOptional()
  @IsDate()
  readonly submissionDate?: Date;

  @IsOptional()
  @IsString()
  readonly status?: string;

  @IsOptional()
  @IsNumber()
  readonly approvedAmount?: number;

  @IsOptional()
  @IsString()
  readonly comments?: string;
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export enum ReviewAction { APPROVE = 'APPROVE', REJECT = 'REJECT', REQUEST_INFO = 'REQUEST_INFO' }
export class ReviewVendorDto {
  @ApiProperty({ enum: ReviewAction }) @IsEnum(ReviewAction) action: ReviewAction;
  @ApiPropertyOptional() @IsOptional() @IsString() note?: string;
}

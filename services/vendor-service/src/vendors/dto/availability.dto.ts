import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { AvailabilityStatus } from '../entities/availability.entity';
export class AvailabilityItemDto {
  @ApiProperty() @IsDateString() date: string;
  @ApiPropertyOptional({ enum: AvailabilityStatus }) @IsOptional() @IsEnum(AvailabilityStatus) status?: AvailabilityStatus;
}
export class AvailabilityInputDto {
  @ApiPropertyOptional({ type: AvailabilityItemDto }) @IsOptional() @ValidateNested() @Type(() => AvailabilityItemDto) item?: AvailabilityItemDto;
  @ApiPropertyOptional({ type: [AvailabilityItemDto] }) @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => AvailabilityItemDto) items?: AvailabilityItemDto[];
}

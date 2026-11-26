import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
export class CreateVendorDto {
  @ApiProperty() @IsString() businessName: string;
  @ApiProperty() @IsString() category: string;
  @ApiProperty() @IsString() district: string;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true }) contactNumbers: string[];
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) pastWorkExamples?: string[];
}

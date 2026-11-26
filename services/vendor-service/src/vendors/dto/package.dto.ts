import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreatePackageDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price: number;
}
export class UpdatePackageDto extends PartialType(CreatePackageDto) {}

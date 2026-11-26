import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { VendorStatus } from '../../vendors/entities/vendor.entity';
export class VendorStatusQueryDto {
  @ApiPropertyOptional({ enum: VendorStatus, default: VendorStatus.PENDING }) @IsOptional() @IsEnum(VendorStatus) status: VendorStatus = VendorStatus.PENDING;
}

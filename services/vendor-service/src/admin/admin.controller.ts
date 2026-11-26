import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/auth';
import { VendorStatus } from '../vendors/entities/vendor.entity';
import { VendorsService } from '../vendors/vendors.service';
import { ReviewVendorDto } from './dto/review-vendor.dto';
import { VendorStatusQueryDto } from './dto/vendor-status-query.dto';
@ApiTags('admin') @ApiHeader({ name: 'x-user-id', required: true }) @ApiHeader({ name: 'x-user-role', required: true })
@Controller('admin/vendors') @Roles('ADMIN')
export class AdminController {
  constructor(private readonly vendors: VendorsService) {}
  @Get() list(@Query() query: VendorStatusQueryDto) { return this.vendors.findByStatus(query.status); }
  @Patch(':id/review') review(@Param('id') id: string, @Body() dto: ReviewVendorDto) { return this.vendors.review(id, dto); }
}

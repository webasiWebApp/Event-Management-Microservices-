import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser, Roles } from '../common/auth';
import { UserRole } from '../common/auth';
import { AvailabilityInputDto } from './dto/availability.dto';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
import { VendorsService } from './vendors.service';

@ApiTags('vendors') @ApiHeader({ name: 'x-user-id', required: true }) @ApiHeader({ name: 'x-user-role', required: true, enum: ['CLIENT','VENDOR','PLANNER','ADMIN'] })
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendors: VendorsService) {}
  @Post() @Roles('VENDOR') create(@CurrentUser() user: RequestUser, @Body() dto: CreateVendorDto) { return this.vendors.create(user.id, dto); }
  @Patch(':id') @Roles('VENDOR') update(@Param('id') id: string, @CurrentUser() user: RequestUser, @Body() dto: UpdateVendorDto) { return this.vendors.update(id, user.id, dto); }
  @Post(':id/packages') @Roles('VENDOR') addPackage(@Param('id') id: string, @CurrentUser() user: RequestUser, @Body() dto: CreatePackageDto) { return this.vendors.addPackage(id, user.id, dto); }
  @Patch(':id/packages/:packageId') @Roles('VENDOR') updatePackage(@Param('id') id: string, @Param('packageId') packageId: string, @CurrentUser() user: RequestUser, @Body() dto: UpdatePackageDto) { return this.vendors.updatePackage(id, packageId, user.id, dto); }
  @Delete(':id/packages/:packageId') @Roles('VENDOR') deletePackage(@Param('id') id: string, @Param('packageId') packageId: string, @CurrentUser() user: RequestUser) { return this.vendors.deletePackage(id, packageId, user.id); }
  @Post(':id/availability') @Roles('VENDOR') availability(@Param('id') id: string, @CurrentUser() user: RequestUser, @Body() dto: AvailabilityInputDto) { return this.vendors.upsertAvailability(id, user.id, dto); }
  @Get() @ApiOperation({ summary: 'List approved vendors' }) list(@Query() query: VendorQueryDto) { return this.vendors.findApproved(query); }
  @Get('packages/:packageId') packageLookup(@Param('packageId') packageId: string) { return this.vendors.findPackage(packageId); }
  @Get(':id') get(@Param('id') id: string) { return this.vendors.findOne(id); }
}

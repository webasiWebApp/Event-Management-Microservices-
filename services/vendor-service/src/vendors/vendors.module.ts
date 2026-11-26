import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from '../admin/admin.controller';
import { EventPublisherService } from '../messaging/event-publisher.service';
import { BookingConsumers } from '../messaging/booking-consumers';
import { Availability } from './entities/availability.entity';
import { Package } from './entities/package.entity';
import { Vendor } from './entities/vendor.entity';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
@Module({ imports: [TypeOrmModule.forFeature([Vendor, Package, Availability])], controllers: [VendorsController, AdminController], providers: [VendorsService, EventPublisherService, BookingConsumers], exports: [VendorsService] })
export class VendorsModule {}

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewAction, ReviewVendorDto } from '../admin/dto/review-vendor.dto';
import { ROUTING_KEYS } from '../common/events';
import { EventPublisherService } from '../messaging/event-publisher.service';
import { Availability, AvailabilityStatus } from './entities/availability.entity';
import { Package } from './entities/package.entity';
import { Vendor, VendorStatus } from './entities/vendor.entity';
import { AvailabilityInputDto } from './dto/availability.dto';
import { CreatePackageDto, UpdatePackageDto } from './dto/package.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';

@Injectable()
export class VendorsService {
  constructor(@InjectRepository(Vendor) private readonly vendors: Repository<Vendor>, @InjectRepository(Package) private readonly packages: Repository<Package>, @InjectRepository(Availability) private readonly availability: Repository<Availability>, private readonly events: EventPublisherService) {}
  async create(ownerUserId: string, dto: CreateVendorDto) {
    return this.vendors.save(this.vendors.create({ ...dto, ownerUserId, pastWorkExamples: dto.pastWorkExamples ?? [] }));
  }
  private async owned(id: string, ownerId: string) {
    const vendor = await this.vendors.findOneBy({ id });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.ownerUserId !== ownerId) throw new ForbiddenException('You do not own this vendor');
    return vendor;
  }
  async update(id: string, ownerId: string, dto: UpdateVendorDto) { const v = await this.owned(id, ownerId); Object.assign(v, dto); return this.vendors.save(v); }
  async addPackage(id: string, ownerId: string, dto: CreatePackageDto) { await this.owned(id, ownerId); return this.packages.save(this.packages.create({ ...dto, vendorId: id })); }
  async updatePackage(id: string, packageId: string, ownerId: string, dto: UpdatePackageDto) {
    await this.owned(id, ownerId); const item = await this.packages.findOneBy({ id: packageId, vendorId: id });
    if (!item) throw new NotFoundException('Package not found'); Object.assign(item, dto); return this.packages.save(item);
  }
  async deletePackage(id: string, packageId: string, ownerId: string) { await this.owned(id, ownerId); const item = await this.packages.findOneBy({ id: packageId, vendorId: id }); if (!item) throw new NotFoundException('Package not found'); await this.packages.remove(item); return { deleted: true }; }
  async upsertAvailability(id: string, ownerId: string, dto: AvailabilityInputDto) {
    await this.owned(id, ownerId); const entries = dto.items ?? (dto.item ? [dto.item] : []);
    if (!entries.length) throw new BadRequestException('Provide item or items');
    return Promise.all(entries.map((entry) => this.setAvailability(id, entry.date, entry.status ?? AvailabilityStatus.AVAILABLE)));
  }
  async setAvailability(vendorId: string, date: string, status: AvailabilityStatus | 'BLOCKED' | 'AVAILABLE') {
    const normalizedStatus = status === 'BLOCKED' ? AvailabilityStatus.BLOCKED : AvailabilityStatus.AVAILABLE;
    await this.availability.upsert({ vendorId, date, status: normalizedStatus }, ['vendorId', 'date']);
    return this.availability.findOneBy({ vendorId, date });
  }
  async findApproved(query: VendorQueryDto) {
    const qb = this.vendors.createQueryBuilder('vendor').leftJoinAndSelect('vendor.packages', 'package').where('vendor.status = :status', { status: VendorStatus.APPROVED });
    if (query.category) qb.andWhere('vendor.category = :category', { category: query.category });
    if (query.district) qb.andWhere('vendor.district = :district', { district: query.district });
    if (query.maxPrice !== undefined) qb.andWhere('EXISTS (SELECT 1 FROM packages p WHERE p."vendorId" = vendor.id AND p.price <= :maxPrice)', { maxPrice: query.maxPrice });
    return qb.getMany();
  }
  async findOne(id: string) { const v = await this.vendors.findOne({ where: { id }, relations: { packages: true, availability: true } }); if (!v) throw new NotFoundException('Vendor not found'); return v; }
  async findPackage(packageId: string) { const p = await this.packages.findOne({ where: { id: packageId }, relations: { vendor: true } }); if (!p) throw new NotFoundException('Package not found'); const { vendor, ...item } = p; return { ...item, vendorId: vendor.id, vendorStatus: vendor.status }; }
  async findByStatus(status: VendorStatus = VendorStatus.PENDING) { return this.vendors.find({ where: { status }, relations: { packages: true } }); }
  async review(id: string, dto: ReviewVendorDto) {
    if ([ReviewAction.REJECT, ReviewAction.REQUEST_INFO].includes(dto.action) && !dto.note?.trim()) throw new BadRequestException('note is required for REJECT and REQUEST_INFO');
    const vendor = await this.vendors.findOneBy({ id }); if (!vendor) throw new NotFoundException('Vendor not found');
    vendor.status = dto.action === ReviewAction.APPROVE ? VendorStatus.APPROVED : dto.action === ReviewAction.REJECT ? VendorStatus.REJECTED : VendorStatus.INFO_REQUESTED;
    vendor.reviewNote = dto.note?.trim() || null; const saved = await this.vendors.save(vendor);
    if (dto.action === ReviewAction.APPROVE || dto.action === ReviewAction.REJECT) await this.events.publish(dto.action === ReviewAction.APPROVE ? ROUTING_KEYS.VENDOR_APPROVED : ROUTING_KEYS.VENDOR_REJECTED, { vendorId: saved.id, ownerUserId: saved.ownerUserId, businessName: saved.businessName, ...(saved.reviewNote ? { note: saved.reviewNote } : {}) });
    return saved;
  }
}

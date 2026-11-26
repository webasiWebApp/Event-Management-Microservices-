import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReviewAction } from '../src/admin/dto/review-vendor.dto';
import { ROUTING_KEYS } from '../src/common/events';
import { AvailabilityStatus } from '../src/vendors/entities/availability.entity';
import { VendorStatus } from '../src/vendors/entities/vendor.entity';
import { VendorsService } from '../src/vendors/vendors.service';

describe('VendorsService', () => {
  let service: VendorsService;
  let vendorRepo: any;
  let packageRepo: any;
  let availabilityRepo: any;
  let publisher: any;

  beforeEach(() => {
    vendorRepo = { create: jest.fn(), save: jest.fn(), findOneBy: jest.fn(), createQueryBuilder: jest.fn(), find: jest.fn() };
    packageRepo = { findOneBy: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    availabilityRepo = { upsert: jest.fn(), findOneBy: jest.fn() };
    publisher = { publish: jest.fn().mockResolvedValue(undefined) };
    service = new VendorsService(vendorRepo, packageRepo, availabilityRepo, publisher);
  });

  it('creates a pending vendor owned by the supplied user', async () => {
    const entity = { ownerUserId: 'user-1', status: VendorStatus.PENDING };
    vendorRepo.create.mockReturnValue(entity);
    vendorRepo.save.mockResolvedValue(entity);

    const result = await service.create('user-1', {
      businessName: 'Bloom Events', category: 'DECORATION', district: 'Colombo', contactNumbers: ['0771234567'],
    });

    expect(vendorRepo.create).toHaveBeenCalledWith(expect.objectContaining({ ownerUserId: 'user-1', pastWorkExamples: [] }));
    expect(result.status).toBe(VendorStatus.PENDING);
  });

  it('rejects edits when the vendor belongs to another user', async () => {
    vendorRepo.findOneBy.mockResolvedValue({ id: 'vendor-1', ownerUserId: 'owner-1' });

    await expect(service.update('vendor-1', 'owner-2', { businessName: 'Changed' })).rejects.toBeInstanceOf(ForbiddenException);
    expect(vendorRepo.save).not.toHaveBeenCalled();
  });

  it('upserts availability for the same vendor and date', async () => {
    availabilityRepo.findOneBy.mockResolvedValue({ vendorId: 'vendor-1', date: '2027-03-15', status: AvailabilityStatus.BLOCKED });

    await service.setAvailability('vendor-1', '2027-03-15', 'BLOCKED');

    expect(availabilityRepo.upsert).toHaveBeenCalledWith(
      { vendorId: 'vendor-1', date: '2027-03-15', status: AvailabilityStatus.BLOCKED },
      ['vendorId', 'date'],
    );
  });

  it('publishes vendor.approved after saving an approval', async () => {
    const vendor = { id: 'vendor-1', ownerUserId: 'user-1', businessName: 'Bloom Events', status: VendorStatus.PENDING, reviewNote: null };
    vendorRepo.findOneBy.mockResolvedValue(vendor);
    vendorRepo.save.mockImplementation(async (record: any) => record);

    const result = await service.review('vendor-1', { action: ReviewAction.APPROVE });

    expect(result.status).toBe(VendorStatus.APPROVED);
    expect(publisher.publish).toHaveBeenCalledWith(ROUTING_KEYS.VENDOR_APPROVED, {
      vendorId: 'vendor-1', ownerUserId: 'user-1', businessName: 'Bloom Events',
    });
  });

  it('requires a note for rejection and does not change the vendor', async () => {
    await expect(service.review('vendor-1', { action: ReviewAction.REJECT })).rejects.toThrow('note is required');
    expect(vendorRepo.findOneBy).not.toHaveBeenCalled();
    expect(publisher.publish).not.toHaveBeenCalled();
  });

  it('reports a missing vendor when reviewing it', async () => {
    vendorRepo.findOneBy.mockResolvedValue(null);

    await expect(service.review('missing', { action: ReviewAction.APPROVE })).rejects.toBeInstanceOf(NotFoundException);
  });
});

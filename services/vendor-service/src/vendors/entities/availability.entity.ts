import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Vendor } from './vendor.entity';

export enum AvailabilityStatus { AVAILABLE = 'AVAILABLE', BLOCKED = 'BLOCKED' }
@Entity('availability')
@Unique(['vendorId', 'date'])
export class Availability {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') vendorId: string;
  @ManyToOne(() => Vendor, (vendor) => vendor.availability, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'vendorId' }) vendor: Vendor;
  @Column({ type: 'date' }) date: string;
  @Column({ type: 'enum', enum: AvailabilityStatus, default: AvailabilityStatus.AVAILABLE }) status: AvailabilityStatus;
}

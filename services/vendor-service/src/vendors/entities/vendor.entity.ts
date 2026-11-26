import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Package } from './package.entity';
import { Availability } from './availability.entity';

export enum VendorStatus { PENDING = 'PENDING', APPROVED = 'APPROVED', REJECTED = 'REJECTED', INFO_REQUESTED = 'INFO_REQUESTED' }
@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') ownerUserId: string;
  @Column() businessName: string;
  @Column() category: string;
  @Column() district: string;
  @Column('text', { array: true, default: '{}' }) contactNumbers: string[];
  @Column('text', { array: true, default: '{}' }) pastWorkExamples: string[];
  @Column({ type: 'enum', enum: VendorStatus, default: VendorStatus.PENDING }) status: VendorStatus;
  @Column({ type: 'text', nullable: true }) reviewNote: string | null;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @OneToMany(() => Package, (item) => item.vendor) packages: Package[];
  @OneToMany(() => Availability, (item) => item.vendor) availability: Availability[];
}

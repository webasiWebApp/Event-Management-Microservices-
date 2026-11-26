import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { Vendor } from './vendor.entity';

const decimalNumber: ValueTransformer = { to: (value: number) => value, from: (value: string | null) => value === null ? null : Number(value) };
@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('uuid') vendorId: string;
  @ManyToOne(() => Vendor, (vendor) => vendor.packages, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'vendorId' }) vendor: Vendor;
  @Column() name: string;
  @Column('text') description: string;
  @Column({ type: 'decimal', precision: 12, scale: 2, transformer: decimalNumber }) price: number;
  @CreateDateColumn() createdAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'car' })
export class Car {
  @PrimaryGeneratedColumn('uuid') uuid: string;
  @Column() vin: string;
  @Column() make: string;
  @Column() model: string;
  @Column() mileage: string;
  @Column() year: number;
  @Column() price: number;
  @Column() zipCode: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

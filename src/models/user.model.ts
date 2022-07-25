import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export  default class Account {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  phone: string;
  
  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  otp: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}

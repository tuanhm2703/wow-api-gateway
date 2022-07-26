import {
  Entity,
  Column,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export  default class Account {
  @PrimaryColumn({ length: 255 })
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

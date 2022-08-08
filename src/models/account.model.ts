import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export default class Account {
  @PrimaryColumn({ length: 255 })
  id: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  profileId: number;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}

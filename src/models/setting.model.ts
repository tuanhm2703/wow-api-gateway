import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('setting')
export default class Setting {
  @PrimaryColumn({ length: 255 })
  id: string;

  @Column({ nullable: true })
  key: string;

  @Column({ type: 'json' })
  value: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}

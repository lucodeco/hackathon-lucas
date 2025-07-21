import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ nullable: true })
  email: string;

  @Index()
  @Column({ nullable: true })
  city: string;

  @Index()
  @Column({ nullable: true })
  country: string;

  @Index()
  @Column({ nullable: true })
  organization: string;

  @Index()
  @Column({ nullable: true })
  region: string;

  @Index()
  @Column({ nullable: true })
  event: string;

  @Index()
  @Column({ nullable: true })
  date: Date;

  @Index()
  @Column('jsonb', { nullable: true, default: {} })
  event_properties: Record<string, any>;

  @Index()
  @Column({ nullable: true })
  project_id: string;

  @Index()
  @Column({ nullable: true })
  interview_id: string;

  @Index()
  @Column({ nullable: true })
  transcript_id: string;

  @Index()
  @Column({ nullable: true })
  button_id: string;
}

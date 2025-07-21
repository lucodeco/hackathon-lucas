import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
}

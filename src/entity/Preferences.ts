import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { IAdmissionType } from '../types/user';
@Entity({ name: 'master_admission_preferences' })
export class Preferences {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column("json")
  preferences: number[];

  @Column({
    nullable: true,
    enum: IAdmissionType,
    type: 'enum'
  })
  admissionType: IAdmissionType;

  @Column({ nullable: true })
  isSubmitted: boolean;

  @Column({ nullable: true })
  submitted_date: Date;

  @Column({ nullable: true })
  last_submitted_date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

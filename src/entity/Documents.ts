import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { IAdmissionType, VerifyDocument } from '../types/document';
import { applicationErrata, errataValues } from "../types/user";
@Entity({ name: 'master_admission_documents' })
export class Documents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: true })
  documentType: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({
    nullable: true,
    enum: IAdmissionType,
    type: 'enum'
  })
  admissionType: IAdmissionType;

  @Column({ type:'enum', enum: errataValues, default:errataValues.FALSE, nullable: true })
  errata: errataValues;

  @Column({ type:'enum', enum: applicationErrata, default:applicationErrata.DEFAULT, nullable: true })
  updated_step: applicationErrata;

  @Column({ type: 'enum', enum: VerifyDocument, default: VerifyDocument.false })
  verify: VerifyDocument;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

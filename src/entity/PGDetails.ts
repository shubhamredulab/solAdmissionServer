import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { result } from "../types/user";
  
  @Entity({ name: 'master_admission_pg_details' })
  export class PGDetails {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: false })
    userId: number;
  
    @Column({ nullable: true })
    Qualification: string;
  
    @Column({ nullable: true })
    pgCollegename: string;
  
    @Column({ nullable: true })
    pgPassingMonth: string;
  
    @Column({ nullable: true })
    pgPassingYear: number;
  
    @Column({ nullable: true })
    pgSeatNo: string;
  
    @Column({ nullable: true })
    pgNoOfAttempt: string;
  
    @Column({ type: 'enum', enum: result, nullable: true })
    resultStatus: result;
  
    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    pgPercentage: number;
  
    @Column({ nullable: true })
    pgGrade: string;

  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  
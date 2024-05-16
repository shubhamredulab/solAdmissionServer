import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { status } from '../types/user';

@Entity({ name: "master_admission_college" })
export class College {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    college_code_admission: string;

    @Column()
    college_name_admission: string;

    @Column({ nullable: true })
    college_address_admission: string;

    @Column({ nullable: true })
    college_logo_admission: string; // server path to access logo

    @Column()
    university_code_admission: number; //university id

    @Column()
    college_type: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column({ nullable: true, type: 'enum', enum: status, default: status.active })
    collegeStatus: status;

    @CreateDateColumn()
    createdAt: Date;
 
    @UpdateDateColumn()
    updatedAt: Date;
}
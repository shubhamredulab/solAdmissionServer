import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IAdmissionType, IInHouse, website_satisfy } from '../types/user';

@Entity({ name: 'master_admission_student_feedback' })
export default class StudentFeedback {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: 'enum', enum: website_satisfy })
    website_satisfy: website_satisfy;

    @Column({ nullable: true, type: 'enum', enum: IInHouse })
    website_recommend: IInHouse;

    @Column({ nullable: true, type: 'enum', enum: website_satisfy })
    staff_satisfy: website_satisfy;

    @Column({ nullable: true, type: 'enum', enum: IInHouse })
    experience_problem: IInHouse;

    @Column({ nullable: true })
    problem: string;

    @Column({ nullable: true })
    suggestion: string;

    @Column({ nullable: true })
    userId: number;

    @Column({ type: 'enum', enum: IAdmissionType, nullable: true })
    admissionType: IAdmissionType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

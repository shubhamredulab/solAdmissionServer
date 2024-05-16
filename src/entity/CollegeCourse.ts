import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { status } from "../types/user";

@Entity({ name: 'master_admission_college_course' })
export default class CollegeCourse {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    college_id_admission: number;

    @Column()
    faculty_id_admission: number;

    @Column()
    department_id_admission: number;

    @Column()
    course_id_admission: number;

    @Column()
    academic_year_admission: string;

    @Column({ nullable: true })
    admissionYear: number;

    @Column({ nullable: true })
    remaining_intake_admission: number;

    @Column()
    intake_admission: number;

    @Column({ nullable: true })
    subject_group_id_admission: number;

    @Column({ nullable: true, type: 'enum', enum: status, default: status.active })
    courseStatus: status;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
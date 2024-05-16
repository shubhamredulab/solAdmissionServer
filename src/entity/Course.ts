import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CourseType, Degree, subjectType } from "../types/user";

@Entity({ name: 'master_admission_course' })
export default class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    course_code_admission: string;

    @Column()
    course_name_admission: string;

    @Column({ type: 'enum', enum: CourseType })
    course_type_admission: CourseType;

    @Column({ type: 'enum', enum: Degree })
    degree: Degree;

    @Column({ type: 'enum', enum: subjectType })
    subjectType: subjectType;

    @Column({ nullable: true })
    eligibilityCourseName: string;

    @Column({ nullable: true, length: 1000 })
    eligibilityDescription: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
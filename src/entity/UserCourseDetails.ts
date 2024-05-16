import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { applicationStatus, universityStatus } from "../types/user";

@Entity({ name: 'master_admission_user_course_details' })
export default class UserCourseDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    college_id: number;

    @Column()
    course_id: number;

    @Column()
    college_course_id: number;

    @Column({ nullable: true, type: 'enum', enum: applicationStatus, default: 'New'})
    college_application_status: applicationStatus;

    @Column({nullable: true})
    admission_form_no: string;

    @Column({nullable: true})
    university_comments: string;

    @Column({ nullable: true, type: 'enum', enum: universityStatus, default: 'New'})
    university_application_status: universityStatus;

    @Column({ nullable: true })
    college_comments: string;

    @Column({ nullable: true })
    ready_to_pay: string;

    @Column({ nullable: true })
    boardNameForPayment : string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
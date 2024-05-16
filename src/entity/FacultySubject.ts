import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'master_admission_faculty_subject' })
export default class FacultySubject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    faculty_phd_id_admission: number;

    @Column()
    subject_phd_id_admission: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
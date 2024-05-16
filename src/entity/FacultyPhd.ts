import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'master_admission_faculty_phd' })
export default class FacultyPhd {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    faculty_phd_name_admission: string;

    @Column({ nullable: true })
    faculty_phd_code_admission: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
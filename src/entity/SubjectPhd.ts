import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'master_admission_subject_phd' })
export default class SubjectPhd {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    subject_phd_code_admission: string;

    @Column()
    subject_phd_name_admission: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
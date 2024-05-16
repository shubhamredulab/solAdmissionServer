import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'master_admission_faculty' })
export default class Faculty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    faculty_code_admission: string;

    @Column()
    faculty_name_admission: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
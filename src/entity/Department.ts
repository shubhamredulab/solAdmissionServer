import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'master_admission_department' })
export default class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    department_code_admission: string;

    @Column()
    department_name_admission: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
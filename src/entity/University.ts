import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'master_admission_university' })
export default class University {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    university_code_admission: string;

    @Column()
    university_name_admission: string;

    @Column()
    university_address_admission: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
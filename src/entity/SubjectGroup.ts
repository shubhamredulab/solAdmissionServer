import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'master_admission_subject_group' })
export default class SubjectGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    group_combination_admission: string;

    @Column('json')
    subject_ids_admission: number[];

    @Column()
    course_id_admission: number;

    @Column()
    medium: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'master_admission_tabmenu' })
export default class Tabmenu {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tabName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
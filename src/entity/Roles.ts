import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IRoles } from '../types/user';
@Entity({ name: 'master_admission_roles' })
export default class Roles {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    roleId: string;

    @Column({ type: 'enum', enum: IRoles, unique: true, nullable: false })
    roleName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
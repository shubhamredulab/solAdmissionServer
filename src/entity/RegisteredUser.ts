import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IAdmissionType } from '../types/user';

@Entity({ name: 'master_admission_registered_users' })
export default class RegisteredUsers {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true }) 
    nameAsOnMarksheet: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    mobileno: string;

    @Column({ nullable: true })
    admissionType: IAdmissionType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
}

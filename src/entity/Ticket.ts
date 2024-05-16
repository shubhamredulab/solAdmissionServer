import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'master_admission_ticket' })
export default class Ticket {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    collegeName: string;

    @Column({ nullable: true })
    courseName: string;

    @Column({ nullable: true })
    categoryName: string;

    @Column({ nullable: true })
    grievance: string;

    @Column({ nullable: true })
    ticketStatus: string;

    @Column({ nullable: true })
    adminReply: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
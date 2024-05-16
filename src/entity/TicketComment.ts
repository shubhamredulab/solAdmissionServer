import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {ticketComment } from "../types/user";
@Entity({ name: 'master_admission_ticket_comment' })
export default class TicketComment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userId: number;

    @Column({ nullable: true })
    ticketId: number;

    @Column({ nullable: true })
    Comment: string;

    @Column({ nullable: true, type: 'enum', default: ticketComment.FALSE, enum: ticketComment })
    readComment: ticketComment;

    @Column({ nullable: true, type: 'enum', default: ticketComment.FALSE, enum: ticketComment })
    adminComment: ticketComment;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'studentnotification' })
export default class studentnotification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Role: string;

    @Column()
    Title: string;

    @Column()
    Notification: string;

    @Column()
    College_Code: string;

    @Column()
    Course_Code: string;

    @Column()
    Status: string;

    @Column()
    StudentId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'notifications' })
export default class notifications {

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
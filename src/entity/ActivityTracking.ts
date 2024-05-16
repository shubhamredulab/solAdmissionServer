import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
@Entity({name:'master_admission_activity_tracking'})
export class ActivityTracking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    userId: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    activity_name: string;

    @Column({ nullable: true, length: 5000 })
    activity: string;

    @Column({ nullable: true })
    ip_address: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}


import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IMeritType, verifationStatus, FeesPaidStatus, SendExcelStatus } from "../types/user";

@Entity({ name: 'master_admission_meritlist' })
export default class MeritList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column({ nullable: true })
    Name: string;

    @Column({ nullable: true })
    email: string;
    @Column("json")
    groupId: number [];

    @Column({ nullable: true })
    registrationNo: number;

    @Column({ nullable: true })
    collegeId: number;

    @Column({ nullable: true })
    courseId: number;

    @Column({ nullable: true })
    categoryName: string;

    @Column({ nullable: true })
    typeOfMeritList: string;

    @Column({ nullable: true })
    percentage: string;

    @Column({ nullable: true })
    mobileno: string;

    @Column({ nullable: true })
    date: string;

    @Column({ nullable: true })
    revoke: string;

    @Column({
        nullable: true,
        enum: IMeritType,
        type: 'enum',
        default: 'MERIT' // Set the default value to 'merit'
    })
    meritType: IMeritType;
    
    @Column({ nullable: true, type: 'enum', default: FeesPaidStatus.FALSE, enum: FeesPaidStatus })
    feesPaid: FeesPaidStatus;

    @Column({ nullable: true, type: 'enum', enum: verifationStatus, default: verifationStatus.NEW })
    status: verifationStatus;

    @Column({ nullable: true, type: 'enum', enum: SendExcelStatus, default: SendExcelStatus.NOT_SEND })
    sendExcelStatus: SendExcelStatus;

    @Column()
    academicYear: number;

    @Column({ nullable: true })
    remark: string;

    @Column({ nullable: true })
    validDateTime: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
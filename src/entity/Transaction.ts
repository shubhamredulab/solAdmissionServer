import {
    Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity({name:'master_admission_transaction'})
export default class Transaction {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    orderId: string;

    @Column({
        nullable: true
    })
    trackingId: string;

    @Column({
        nullable: true
    })
    bankRefNo: string;

    @Column({
        nullable: true
    })
    orderStatus: string;

    @Column({
        nullable: true
    })
    paymentMode: string;

    @Column({
        nullable: true
    })
    currency: string;

    @Column({
        nullable: true
    })
    amount: string;

    @Column({
        nullable: true
    })
    billingName: string;

    @Column({
        nullable: true
    })
    billingTel: string;

    @Column({
        nullable: true
    })
    billingEmail: string;

    @Column({
        nullable: true
    })
    merchantParam1: string;

    @Column({
        nullable: true
    })
    merchantParam2: string;

    @Column({
        nullable: true
    })
    merchantParam3: string;

    @Column({
        nullable: true
    })
    merchantParam4: string;

    @Column({
        nullable: true
    })
    merchantParam5: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}



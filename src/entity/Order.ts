import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { IAdmissionType } from '../types/user';

@Entity({name:'master_admission_order'})
export default class Order {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
      nullable: true
  })
  serialNo: string;

  @Column({
      nullable: true
  })
  userId: number;

  @Column({
      nullable: true,
      enum: IAdmissionType,
      type: 'enum'
  })
  admissionType: IAdmissionType;

  @Column({
      nullable: true
  })
  status: number;

  @Column({
      nullable: true
  })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}



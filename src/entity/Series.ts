import {
    Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
    UpdateDateColumn
  } from 'typeorm';
  import { IAdmissionType, ITypeName } from '../types/user';
  
  @Entity({name:'master_admission_series'})
  export default class Series {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
        nullable: true,
        enum: ITypeName,
        type: 'enum'
    })
    typeName: ITypeName;
  
    @Column({
        nullable: true
    })
    StartRange: string;
  
    @Column({
        nullable: true,
        enum: IAdmissionType,
        type: 'enum'
    })
    admissionType: IAdmissionType;
  
    @Column({
        nullable: true
    })
    Year: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
  }
  
  
  
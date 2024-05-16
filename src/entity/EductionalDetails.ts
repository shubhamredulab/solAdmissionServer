import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { IInHouse, course, entranceExam, result, stream } from "../types/user";
@Entity({ name: 'master_admission_educational_details' })
export class EducationalDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: true })
  sscObtainedMarks: number;

  @Column({ nullable: true })
  sscOutOf: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true})
  sscPercentage: number;

  @Column({ nullable: true })
  sscGrade: string;

  @Column({ nullable: true })
  hscCollegeName: string;

  @Column({ nullable: true })
  hscPassingState: string;

  @Column({ nullable: true })
  hscPassingYear: number;

  @Column({ nullable: true })
  hscPassingMonth: string;

  @Column({ nullable: true })
  hscSeatNo: string;

  @Column({ nullable: true })
  hscMarksObtained: number;

  @Column({ nullable: true })
  hscOutOf: number;

  @Column({ type: 'enum', enum: stream, nullable: true })
  hscStream: stream;

  @Column({ nullable: true })
  hscGrade: string;

  @Column({ nullable: true })
  hscNoOfAttempt: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true})
  hscPercentage: number;

  @Column({ nullable: true })
  achievements: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  biologyPercentage: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  mathPercentage: number;

  @Column({ nullable: true })
  ugCollegename: string;

  @Column({ type: 'enum', enum: course, nullable: true })
  ugCourseName: course;

  @Column({ nullable: true })
  ugPassingMonth: string;

  @Column({ nullable: true })
  ugPassingYear: number;

  @Column({ nullable: true })
  ugSeatNo: string;

  @Column({ nullable: true })
  ugNoOfAttempt: string;

  @Column({ nullable: true })
  ugEntranceMarks: number;

  @Column({type: 'enum', enum: entranceExam, nullable: true })
  EntranceExam: entranceExam;

  @Column({ nullable: true })
  EntranceYear: number;

  @Column({ type: 'enum', enum: result, nullable: true })
  resultStatus: result;

  @Column({ nullable: true })
  ugMarksObtained: number;

  @Column({ nullable: true })
  ugOutof: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true})
  ugPercentage: number;

  @Column({ nullable: true })
  ugGrade: string;

  @Column({ nullable: true })
  ugselectChoice: string;

  @Column({ nullable: true })
  hscselectChoice: string;

  @Column({ nullable: true })
  sscselectChoice: string;

  @Column({ nullable: true })
  ugQualificationName: string;

  @Column({ nullable: true })
  admissionYear: number;

  @Column({ nullable: false })
  admissionType: string;

  @Column({
    nullable: true, enum: IInHouse,
    type: 'enum'
  })
  inHouse: IInHouse;

  @Column({nullable:true})
  boardtype: string;

  @Column({nullable:true})
  sscPassingState: string;

  @Column({nullable:true})
  sscBoardName:string;

  @Column({nullable:true})
  sscCollegeName:string;

  @Column({nullable:true})
  sscPassingMonth:string;

  @Column({nullable:true})
  sscPassingYear:number;

  @Column({nullable:true})
  hscBoardName:string;

  @Column({nullable:true})
  sscSeatNo:string;

  @Column({ nullable: true })
  otherEntranceExam: string;

  @Column({nullable:true})
  otherHscBoardName: string;

  @Column({nullable:true})
  otherSscBoardName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

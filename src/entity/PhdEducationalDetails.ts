import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
@Entity({ name: 'master_admission_phd_educational_details' })
export class PhdEducationalDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: true })
  ugMarksObtained: number;

  @Column({ nullable: true })
  ugOutOf: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  ugPercentage: number;

  @Column({ nullable: true })
  ugGrade: string;

  @Column({ nullable: true })
  ugCollegeName: string;

  @Column({ nullable: true })
  ugPassingYear: number;

  @Column({ nullable: true })
  ugPassingMonth: string;

  @Column({ nullable: true })
  ugdegreename: string;

  @Column({ nullable: true })
  ugSpecialization: string;

  @Column({ nullable: true })
  ugUniversitynName: string;

  @Column({ nullable: true })
  ugResultStatus: string;

  @Column({ nullable: true })
  ugSelectChoice: string;


  @Column({ nullable: true })
  pgMarksObtained: number;

  @Column({ nullable: true })
  pgOutOf: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  pgPercentage: number;

  @Column({ nullable: true })
  pgGrade: string;

  @Column({ nullable: true })
  pgCollegeName: string;

  @Column({ nullable: true })
  pgPassingYear: number;

  @Column({ nullable: true })
  pgPassingMonth: string;

  @Column({ nullable: true })
  pgdegreename: string;

  @Column({ nullable: true })
  pgSpecialization: string;

  @Column({ nullable: true })
  pgUniversitynName: string;

  @Column({ nullable: true })
  pgResultStatus: string;

  @Column({ nullable: true })
  pgSelectChoice: string;

  @Column({ nullable: true })
  facultyName: string;

  @Column({ nullable: true })
  subjectName: string;

  @Column('json', { nullable: true })
  setEntranceDetails: string[];

  @Column('json', { nullable: true })
  netEntranceDetails: string[];

  @Column('json', { nullable: true })
  gateEntranceDetails: string[];

  @Column('json', { nullable: true })
  mphilEntranceDetails: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

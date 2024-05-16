import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum Status {
  Start = 'Start',
  Stop = 'Stop',
}

@Entity({ name: 'master_admission_action' })
export default class AdmissionAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Status,default: Status.Stop})
  status: string;

  @Column()
  admissionType: string;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

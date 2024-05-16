import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity({ name: 'master_admission_menuitem' })
export default class MenuItem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    email: string;

    @Column()
    role: string;

    @Column('json', { nullable: true })
    menuName: string[];

    @Column('json', { nullable: true })
    degreeType: string[];

    @Column('json', { nullable: true })
    columnName: string[];

    @Column('json', { nullable: true })
    collegeId: number[];

    @Column('json', { nullable: true })
    courseId: number[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}

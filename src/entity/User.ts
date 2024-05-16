import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { IRoles, IAdmissionType, bloodGroup, religion, minority, admissionCategory, Category, IInHouse, IenumValues, maretialStatus, employeeStatus } from '../types/user';

@Entity({ name: 'master_admission_users' })
export default class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({nullable: true })
    middleName:string;

    @Column()
    nameAsOnMarksheet: string;

    @Column()
    email: string;

    @Column("bigint", {nullable:true})
    mobileno: string;
    
    @Column({ nullable: true })
    dob: string;

    @Column({ nullable: true })
    gender: string;

    @Column({type: 'enum', enum: bloodGroup, nullable: true })
    bloodGroup: bloodGroup;

    @Column({ nullable: true })
    nameAsPerAadharCard: string;

    @Column({ nullable: true })
    aadharCardno: string;

    @Column({ nullable: true })
    corCity: string;

    @Column({ nullable: true })
    corState: string;

    @Column({ nullable: true })
    corAddress: string;

    @Column({type: 'enum', enum: religion, nullable: true })
    religion: religion;

    @Column({type: 'enum', enum: minority, nullable: true })
    minority: minority;

    @Column({ nullable: true })
    corPincode: string;

    @Column({nullable: true })
    corLocationArea: string;

    @Column({nullable: true })
    corDistrict: string;

    @Column({nullable: true })
    corTaluka: string;

    @Column({ nullable: true })
    motherName: string;

    @Column({ nullable: true })
    fatherName: string;

    @Column({ nullable: true })
    guardianMobileno: string;

    @Column({
        nullable: true,
        enum: IAdmissionType,
        type: 'enum'
    })
    admissionType: IAdmissionType;

    @Column({ type: 'enum', enum: admissionCategory, nullable: true })
    admissionCategory: admissionCategory;

    @Column({ type: 'enum', enum: IRoles, default: IRoles.STUDENT })
    role: IRoles;

    @Column({ nullable: true })
    keycloakId: string;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    registrationNo: number;

    @Column({ nullable: true })
    imagesName: string;

    // @Column({ type: 'enum', enum: learningDisability, nullable: true })
    // learningDisability: learningDisability;

    @Column({nullable: true })
    learningDisability: string;

    @Column({ type: 'enum', enum: Category, nullable: true })
    category: Category;

    @Column({ nullable: true })
    academicYear: number;

    @Column({ nullable: true })
    registerYear: string;

    @Column({nullable: true })
    placeOfBirth:string;

    @Column({
        nullable: true, enum: IInHouse,
        type: 'enum'
      })
      voterName: IInHouse;

    @Column({nullable:true})
    motherTongue:string;

    @Column({nullable:true})
    educationGap:number;

    @Column({nullable:true})
    citizenShip:string;

    @Column({ nullable: true, type: "numeric", precision: 20 }) // Adjust precision as needed
    abcId: number;

    @Column({nullable:true})
    guardianAnnualIncome:string;

    @Column({nullable:true})
    guardianOccupation:string;

    @Column({nullable:true})
    guardianName:string;

    @Column({nullable:true})
    relationWithGuardian:string;

    @Column({nullable:true, enum:employeeStatus, type:'enum'})
    employeeStatus:employeeStatus;

    @Column({nullable:true})
    preAddress:string;

    @Column({nullable:true})
    prePincode:string;

    @Column({nullable:true})
    preCity:string;

    @Column({nullable:true})
    preState:string;

    @Column({nullable:true})
    preLocationArea:string;

    @Column({nullable:true})
    preDistrict:string;

    @Column({nullable:true})
    preTaluka:string;

    @Column({nullable:true, enum:IenumValues, type:'enum'})
    speciallyAbled:IenumValues;

    @Column({nullable:true})
    domicileState:string;

    @Column({nullable:true, enum:maretialStatus, type:'enum'})
    maritalStatus:maretialStatus;

    @Column({nullable:true, enum:IenumValues, type:'enum'})
    isAddressSame:IenumValues;

    @Column({ nullable: true, type: 'nvarchar' })
    nameInRegional: string;

    @Column({nullable:true})
    corFaltNo: string;

    @Column({nullable:true})
    corArea: string;

    @Column({nullable:true})
    corLandmark: string;

    @Column({nullable:true})
    corCountry: string;
 
    @Column({nullable:true})
    preFaltNo:string;
    
    @Column({nullable:true})
    preArea:string;

    @Column({nullable:true})
    preLandmark:string;

    @Column({nullable:true})
    preCountry:string;

    @Column("bigint", {nullable:true})
    whatsAppno:string;

    @Column({nullable:true})
    isWhatsappNoSame:string;
    
    @Column({nullable:true})
    nonCreamy:string;

    @Column({nullable:true})
    petExam:string;

    @Column({nullable:true})
    passedSetExam:string;

    @Column({nullable:true})
    passedNetExam:string;

    @Column({nullable:true})
    passedGateExam:string;

    @Column({nullable:true})
    passedMphilExam:string;

    @Column({nullable:true})
    dstFellowship:string;

    @Column({nullable:true})
    womenReservation:string;

    @Column({nullable:true})
    whichUniversity:string;

    @Column({nullable:true})
    otherMotherTongue:string;

    @Column({ nullable: true })
    otherReligion: string;

    @Column({nullable:true})
    fellowShipGrantedYear:number;

    @Column({nullable:true})
    fellowShipGrantedMonth:string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

export enum IAdmissionType {
    UG = 'UG',          
    PG = 'PG',
    DIPLOMAUG = 'DIPLOMA-UG',
    DIPLOMAPG = 'DIPLOMA-PG',
    INTEGRATED = 'INTEGRATED',
    CERTIFICATION = 'CERTIFICATION',
    PHD='PHD'
}
 
export interface admissionTypeCount {
    master_admission_documents_admissionType:string,
    count:string
}

export enum VerifyDocument {
    true = 'true',
    false = 'false'
}

export enum IRoles {
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
    SUB_ADMIN = 'SUB_ADMIN',
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    UNIVERSITY='UNIVERSITY'
}

export interface IkeycloakRole {
    id: string,
    name: IRoles,
    description: string,
    composite: boolean,
    clientRole: boolean,
    containerId: string
}

export enum CourseType {
    AIDED = 'AIDED',
    UNAIDED = 'UNAIDED'
}

export enum subjectType {
    BIOLOGY = 'BIOLOGY',
    IT = 'IT',
    OTHERS = 'OTHERS',
    BA='BA'
}

export enum applicationStatus {
    NEW = 'New',
    ACCEPT = 'Accept',
    REJECT = 'Reject',
    HOLD = 'Hold',
    CANCEL='Cancel'
}

export enum universityStatus {
    NEW = 'New',
    ACCEPT = 'Accept',
    REJECT = 'Reject',
    HOLD = 'Hold'
}

export enum applicationErrata {
    DEFAULT = 'default',
    REQUESTED = 'requested',
    CHANGED = 'changed',
}

export enum errataValues {
    TRUE = '1',
    FALSE = '0'
}

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
    master_admission_users_admissionType:string,
    count:string
}

export enum verifationStatus {
    NEW = 'NEW',
    VERIFY = 'VERIFY',
    PENDING = 'PENDING'
}

export enum IMeritType {
    MERIT = 'MERIT',          
    MQ = 'MQ'
}

export enum IInHouse {
    YES = 'YES',          
    NO = 'NO'
}
export enum ITypeName {
    registrationNo = 'registrationNo',          
    seriesNo = 'seriesNo'
}

export enum Degree {
    Bachelor = 'Bachelor',
    Diploma = 'Diploma',
    Master = 'Master'
}

export enum FeesPaidStatus {
    FALSE = 'false',
    TRUE = 'true'
}

export enum SendExcelStatus {
    SEND = 'Send',
    NOT_SEND = 'NOT SEND'
}

export enum ticketComment {
    FALSE = 'false',
    TRUE = 'true'
}

export enum website_satisfy {
    UNSATISFY = 'Unsatisfy',
    CAN_IMPROVE = 'can_improve',
    GOOD = 'good',
    BEST = 'best',
}

export const StateName = {
    states: [
        'Andhra Pradesh',
        'Arunachal Pradesh',
        'Assam',
        'Bihar',
        'Chhattisgarh',
        'Goa',
        'Gujarat',
        'Haryana',
        'Himachal Pradesh',
        'Jharkhand',
        'Karnataka',
        'Kerala',
        'Madhya Pradesh',
        'Maharashtra',
        'Manipur',
        'Meghalaya',
        'Mizoram',
        'Nagaland',
        'Odisha',
        'Punjab',
        'Rajasthan',
        'Sikkim',
        'Tamil Nadu',
        'Telangana',
        'Tripura',
        'Uttar Pradesh',
        'Uttarakhand',
        'West Bengal',
        'Andaman and Nicobar Islands',
        'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi',
        'Lakshadweep',
        'Puducherry'
    ]
};

export enum status {
    active = 'active',
    inactive = 'inactive'
}


export const Values = {
    admission_category: ['Open/General', 'Reserved', 'Physically Handicap', 'Sports (National / State Level)', 'Cultural (National / State Level)', 'Jammu Kashmir Migrant', 'Ex-Serviceman', 'Ward of Transferred Central/State Govt Employee', 'Ward of Defence Personel', 'Child/Grandchild of Freedom Fighter'],
    learning_Disability: ['Totally blind(पूर्णपणे आंधळा) ',
    'Partially blind(अर्धवट आंधळा)',
    'Leprosy Prevention(कुष्ठरोग प्रतिबंधक)',
    'Hearing impairment(श्रवणदोष )',
    'Locomotordisability(लोकोमोटर डिसॅबिलिटी)',  
    'Stunting Physical Growth(शारीरिक वाढ खुंटणे) ',
    'Intellectual disability (retarded/locomotive(बौद्धिक अपंगत्व (मंद / लोकोमोटिव्ह))',
    'Mental illness(मानसिक आजार)',
    'Self-immersed(आत्ममग्न)',
    'Cerebral Palsy(सेरेब्रल पाल्सी)',
    'Permanent deformities(कायमस्वरूपी विकृती)',
    'Acute medullary disease with orthopaedic(ऑर्थोपेडिकसह तीव्र मेड्युलरी रोग)',
    'Study Disabled(अभ्यास अक्षम)',
    'Multiple Depression Disorders(एकाधिक नैराश्य विकार)',
    'Speech and language disability(भाषण आणि भाषा अक्षमता)',
    'Thalassemia / Cancer(थॅलेसेमिया / कर्करोग)',
    'Haemophilia(हिमोफिलिया)',
    'Sickle cell disease(सिकलसेल रोग) ',
    'Multiple handicapped(एकाधिक अपंग)',
    'Acid Attack Victome(ऍसिड हल्ला बळी)',
    'Parkinsons disease(पार्किन्सन रोग)'],
    stream: ['Arts', 'Commerce', 'Science'],
    // result: ['Distinction', 'First Class', 'Higher Second Class', 'Second Class', 'Pass Class', 'Successful', 'Outstanding - Explary', 'Awaited'],
    result: ['Pass', 'Result Awaited'],
    Category: ['General', 'OBC', 'SC', 'ST', 'EWS', 'NTA', 'NTB', 'NTC', 'NTD', 'SBC', 'SEBC ', 'Others'],
    course: ['BA', 'BBA', 'BMS', 'BAF', 'BFM', 'BBI', 'BMM', 'BAFTNMP', 'BAMMC', 'BCOM', 'BSC', 'BE', 'BTECH', 'BVoc', 'Other'],
    entranceExam: ['Not Appeared', 'CET', 'ATMA', 'CAT', 'CMAT', 'HCET', 'HLAT', 'IIFT', 'MACET', 'MAT', 'NET', 'SAT', 'SET', 'SNAP', 'TISSNET', 'UCC/CSIR', 'Other'],
    blood_group: ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-', 'AOB'],
    motherTongue: ['Marathi', 'Hindi', 'English', 'Other'],
    grades: ['O', 'A+', 'A', 'B+', 'B', 'C', 'D'],
    annual_Income : ["Below 50,000", "50,001 to 2,00,000", "2,00,001 to 5,00,000", "5,00,001 to 10,00,000", "Above 10,00,000"],
    boardName: ['Central Board of Secondary Education (CBSE)', 'Maharashtra State Board Of Secondary and Higher Secondary Education (MSBSHSE)', 'Indian Certificate of Secondary Education (ICSE)', 'Council for the Indian School Certificate Examination (CISCE)', 'National Institute of Open Schooling (NIOS)', 'International Baccalaureate (IB)', 'Cambridge International Examinations (CIE)', 'Others']
    // Achievements : ['Not Applicable', 'Sports', 'Cultural', 'Other']
};

export interface ManageRole {
    id: string,
   name: string,
   description: string,
   composite: boolean,
   clientRole: boolean,
   containerId: string
 }

 export enum admissionCategory {
    GENERAL = 'Open/General', 
    RESERVED = 'Reserved', 
    PHYSICALLY_HANDICAP = 'Physically Handicap', 
    SINDHI = 'Sindhi Linguistic Minority', 
    SPORTS = 'Sports (National / State Level)', 
    CULTURAL = 'Cultural (National / State Level)', 
    JAMMU_KASHMIR_MIGRANT = 'Jammu Kashmir Migrant', 
    EX_SERVICEMAN = 'Ex-Serviceman', 
    GOVT_EMPLOYEE = 'Ward of Transferred Central/State Govt Employee', 
    DEFENCE_PERSONAL = 'Ward of Defence Personel', 
    FREEDOM_FIGHTER = 'Child/Grandchild of Freedom Fighter'
 }

//  export enum learningDisability {
//     TotallyBlind = 'Totally blind(पूर्णपणे आंधळा) ',
//     PartiallyBlind = 'Partially blind(अर्धवट आंधळा)',
//     LeprosyPrevention = 'Leprosy Prevention(कुष्ठरोग प्रतिबंधक)',
//     HearingImpairment = 'Hearing impairment(श्रवणदोष )',
//     Locomotordisability = 'Locomotordisability(लोकोमोटर डिसॅबिलिटी)',  
//     StuntingPhysicalGrowth = 'Stunting Physical Growth(शारीरिक वाढ खुंटणे) ',
//     Intellectualdisability = 'Intellectual disability (retarded/locomotive(बौद्धिक अपंगत्व (मंद / लोकोमोटिव्ह))',
//     Mentalillness = 'Mental illness(मानसिक आजार)',
//     Selfimmersed = 'Self-immersed(आत्ममग्न)',
//     CerebralPalsy = 'Cerebral Palsy(सेरेब्रल पाल्सी)',
//     Permanentdeformities = 'Permanent deformities(कायमस्वरूपी विकृती)',
//     Acutemedullary = 'Acute medullary disease with orthopaedic(ऑर्थोपेडिकसह तीव्र मेड्युलरी रोग)',
//     StudyDisabled ='Study Disabled(अभ्यास अक्षम)',
//     MultipleDepression = 'Multiple Depression Disorders(एकाधिक नैराश्य विकार)',
//     Speechandlanguagedisability = 'Speech and language disability(भाषण आणि भाषा अक्षमता)',
//     Thalassemia = 'Thalassemia / Cancer(थॅलेसेमिया / कर्करोग)',
//     Haemophilia = 'Haemophilia(हिमोफिलिया)',
//     Sickle = 'Sickle cell disease(सिकलसेल रोग) ',
//     Multiplehandicapped = 'Multiple handicapped(एकाधिक अपंग)',
//     AcidAttackVictome = 'Acid Attack Victome(ऍसिड हल्ला बळी)',
//     Parkinsonsdisease = 'Parkinsons disease(पार्किन्सन रोग)'
//  }

 export enum stream {
    ARTS = 'Arts', 
    COMMERCE = 'Commerce', 
    SCIENCE = 'Science'
 }

 export enum result {
    DISTINCTION = 'Distinction', 
    FIRSTCLASS = 'First Class', 
    HIGHER_SECOND_CLASS = 'Higher Second Class', 
    SECONDCLASS = 'Second Class', 
    PASSCLASS = 'Pass Class', 
    SUCCESSFUL = 'Successful', 
    OUTSTANDING = 'Outstanding - Explary', 
    FAIL = 'Fail/ATKT', 
    AWAITED = 'Awaited',
    PASS = 'Pass',
    RESULT_AWAITED = 'Result Awaited'
 }

 export enum Category {
    GENERAL = 'General', 
    OBC = 'OBC', 
    SC = 'SC', 
    ST = 'ST', 
    EMS = 'EWS', 
    NTA = 'NTA', 
    NTB = 'NTB', 
    NTC = 'NTC', 
    NTD = 'NTD', 
    SBC = 'SBC', 
    OTHERS = 'Others'
 }

 export enum course {
    BA = 'BA', 
    BBA = 'BBA', 
    BMS = 'BMS', 
    BAF = 'BAF', 
    BFM = 'BFM', 
    BBI = 'BBI', 
    BMM = 'BMM', 
    BAFTNMP = 'BAFTNMP', 
    BAMMC = 'BAMMC', 
    BCOM = 'BCOM', 
    BSC = 'BSC', 
    BE = 'BE', 
    BTECH = 'BTECH', 
    BVoc = 'BVoc', 
    OTHER = 'Other'
 }

 export enum entranceExam {
    NOT_APPEARED = 'Not Appeared', 
    ATMA = 'ATMA', 
    CAT = 'CAT', 
    CMAT = 'CMAT', 
    HCET = 'HCET', 
    HLAT = 'HLAT', 
    IIFT = 'IIFT', 
    MACET = 'MACET', 
    MAT = 'MAT', 
    NET = 'NET', 
    SAT = 'SAT', 
    SET = 'SET', 
    SNAP = 'SNAP', 
    TISSNET = 'TISSNET', 
    UCC_CSIR = 'UCC/CSIR', 
    OTHER = 'Other',
    CET = 'CET'
 }

 export enum bloodGroup {
    A = 'A+', 
    B = 'O+', 
    C = 'B+', 
    D = 'AB+', 
    E = 'A-', 
    F = 'O-', 
    G = 'B-', 
    H = 'AB-',
    I = 'AOB'
 }

 export enum religion {
    Hinduism = 'Hinduism',
    Islam = 'Islam',
    Christianity = 'Christianity',
    Sikhism = 'Sikhism',
    Buddhism = 'Buddhism',
    Jainism = 'Jainism',
    Zoroastrianism = 'Zoroastrianism',
    Sindhi = 'Sindhi',
    Others = 'Others'
 }

 export enum minority {
    Hindu = 'Hindu',
    Muslim = 'Muslim',
    Christian = 'Christian',
    Sikh = 'Sikh',
    Buddist = 'Buddist',
    Jain = 'Jain',
    Parsi = 'Parsi',
    Sindhi = 'Sindhi',
    Others = 'Others'
 }

 export enum IenumValues {
    Yes = 'Yes',          
    No = 'No'
}

export enum maretialStatus{
    Married = 'Married',
    Unmarried = 'Unmarried'
}

export enum employeeStatus{
    Employed = 'Employed',
    Unemployed = 'Unemployed'
}

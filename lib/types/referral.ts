export interface PatientInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  medicareNumber: string;
  medicareRef: string;
  medicareExpiry: string;
  pensionNumber: string;
  dvaNumber: string;
}

export interface MedicalHistory {
  primaryCarePhysician: string;
  referringPhysician: string;
  referringPhysicianPhone: string;
  chiefComplaint: string;
  currentMedications: string;
  allergies: string;
  pastMedicalHistory: string;
  pastSurgicalHistory: string;
  familyHistory: string;
  socialHistory: string;
}

export interface SleepHistory {
  bedtime: string;
  wakeTime: string;
  sleepLatency: string;
  numberOfAwakenings: string;
  snoring: boolean;
  witnessedApneas: boolean;
  gaspingChoking: boolean;
  morningHeadaches: boolean;
  dryMouth: boolean;
  nocturia: string;
  unrefreshing: boolean;
  daytimeSleepin: boolean;
}

export interface TestsOrdered {
  level2PSGMedicare: boolean;
  level2PSGPatientFunded: boolean;
  level3OSAExpress: boolean;
}

export interface OSA50Answer {
  questionId: number;
  answer: 'yes' | 'no' | 'maybe';
  score: number;
}

export interface STOPBANGAnswer {
  questionId: number;
  answer: 'yes' | 'no';
  score: number;
}

export interface EpworthAnswer {
  questionId: number;
  score: number;
}

export interface ReferralReason {
  witnessedApnoeaOrChoking: boolean;
  regularLoudSnoring: boolean;
  regularFatigueOrDaytimeSleepiness: boolean;
  typeIIDiabetes: boolean;
  other: boolean;
  hypertension: boolean;
  cardiacDisease: boolean;
  obesity: boolean;
  neurologicalIssues: boolean;
  stroke: boolean;
  depression: boolean;
  frequentNocturia: boolean;
  sleepyDriving: boolean;
}

export interface ReferringDoctor {
  name: string;
  address: string;
  practiceName: string;
  providerNo: string;
  date: string;
  signature: string | null;
}

export interface ReferralFormData {
  patientInfo: PatientInfo;
  medicalHistory: MedicalHistory;
  sleepHistory: SleepHistory;
  testsOrdered: TestsOrdered;
  referralReason: ReferralReason;
  referringDoctor: ReferringDoctor;
  osa50Answers: OSA50Answer[];
  osa50Score: number;
  stopbangAnswers: STOPBANGAnswer[];
  stopbangScore: number;
  epworthAnswers: EpworthAnswer[];
  epworthScore: number;
  additionalNotes: string;
}

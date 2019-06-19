
export class Plan {
  conceptId: string;
  score: number;
  name: string;
  weight: number;
  subPlans: Plan[];
  patientList100: string;
  patientList0: string;
  patientListPart: string;
  icons: string[];
  filter: string;
}

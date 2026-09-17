export interface Subject {
    id: number;
    name: string;
    code: string;
}

export interface StudentDetail {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ClassGroup {
    id: number; 
    name: string;
    term: number;
    term_name: string;
    subject: Subject;
    subject_name: string;
    teacher: number;
    students: number[];
    students_detail: StudentDetail[];
}

export interface Activity {
    id: number;
    title: string;
    description: string;
    instructions: string;
    due_date: string;
    group: number;
    file?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Submission {
    id: number;
    activity: number;
    student: number;
    file: string | null;
    grade: number | null;
    submitted_at: string;
    updated_at: string;
}

export interface CreateActivityPayload {
    title: string;
    description: string;
    instruction: string;
    due_date: string;
    group: number;
}

export interface UpdateSubmissionPayload {
    grade: number;
}
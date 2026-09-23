export interface ClassGroup {
    id: number;
    name: string;
    term: number;
    term_name: string;
    subject: number;
    subject_name: string;
    teacher: number;
    teacher_name: string;
    students: number[];
}

export interface Activity {
    id: number;
    title: string;
    description: string;
    partial_period: number;
    teacher_file: string | null;
    is_team_activity: boolean;
    created_at: string;
    group: number;
}

export type SubmissionStatus = 'Entregado' | 'En revisión' | 'Calificado';

export interface Submission {
    id: number;
    student_file: string | null;
    status: SubmissionStatus;
    grade: string | null;
    created_at: string;
    updated_at: string;
    activity: number;
    student: number | null;
    work_team: number | null;
}

export interface WorkTeam {
    id: number;
    name: string;
    group: number;
    members: number[];
}

export interface StudentSummary {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface GroupAverage {
    student_id: number | string;
    partial: string;
    average_grade: number | null;
}

export interface CreateActivityPayload {
    title: string;
    description: string;
    partial_period: number;
    is_team_activity: boolean;
    group: number;
    teacher_file: File | null;
}

export interface CreateWorkTeamPayload {
    name: string;
    group: number;
    members: number[];
}

export interface CreateSubmissionPayload {
    activity: number;
    student_file: File;
    work_team: number | null;
}

export interface GradeSubmissionPayload {
    grade: number;
    status: SubmissionStatus;
}

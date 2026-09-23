import type { ClassGroup, Activity, Submission, WorkTeam, StudentSummary } from '../types';

// En actividades de equipo la entrega pertenece al equipo del alumno
export function findStudentSubmission(
    submissions: Submission[], activity: Activity, studentId: number, teams: WorkTeam[],
): Submission | undefined {
    const team = activity.is_team_activity ? findStudentTeam(teams, activity.group, studentId) : undefined;
    return submissions.find((submission) =>
        submission.activity === activity.id &&
        (submission.student === studentId || (team !== undefined && submission.work_team === team.id)),
    );
}

export function findStudentTeam(teams: WorkTeam[], groupId: number, studentId: number): WorkTeam | undefined {
    return teams.find((team) => team.group === groupId && team.members.includes(studentId));
}

export function expectedSubmissions(activity: Activity, group: ClassGroup | undefined, teams: WorkTeam[]): number {
    if (!group) return 0;
    if (activity.is_team_activity) return teams.filter((team) => team.group === group.id).length;
    return group.students.length;
}

export function studentFullName(student: StudentSummary | undefined): string {
    if (!student) return 'Alumno desconocido';
    const fullName = `${student.first_name} ${student.last_name}`.trim();
    return fullName || student.username;
}

export function studentIdentifier(student: StudentSummary | undefined, fallbackId: number): string {
    return student?.matricula || student?.username || String(fallbackId);
}

export function formatDateTime(isoDate: string): string {
    return new Date(isoDate).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function isPastDue(activity: Activity): boolean {
    return activity.due_date !== null && new Date(activity.due_date).getTime() < Date.now();
}

export function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function fileNameFromUrl(fileUrl: string): string {
    return decodeURIComponent(fileUrl.split('/').pop() ?? fileUrl);
}

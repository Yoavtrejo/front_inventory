import type { ClassGroup, Activity, Submission, WorkTeam, StudentSummary } from '../types';

export function groupsTaughtBy(groups: ClassGroup[], teacherId: number | null): ClassGroup[] {
    return groups.filter((group) => group.teacher === teacherId);
}

export function groupsOfStudent(groups: ClassGroup[], studentId: number | null): ClassGroup[] {
    return studentId === null ? [] : groups.filter((group) => group.students.includes(studentId));
}

export function activitiesOfGroups(activities: Activity[], groups: ClassGroup[]): Activity[] {
    const groupIds = new Set(groups.map((group) => group.id));
    return activities.filter((activity) => groupIds.has(activity.group));
}

export function submissionsOfActivities(submissions: Submission[], activities: Activity[]): Submission[] {
    const activityIds = new Set(activities.map((activity) => activity.id));
    return submissions.filter((submission) => activityIds.has(submission.activity));
}

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

export function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function fileNameFromUrl(fileUrl: string): string {
    return decodeURIComponent(fileUrl.split('/').pop() ?? fileUrl);
}

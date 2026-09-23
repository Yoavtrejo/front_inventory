'use client';

import { useState } from 'react';
import { academicService } from '@/features/academic';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { ClassGroup, WorkTeam } from '@/features/academic';

const MAX_TEAM_MEMBERS = 7;

export function useCrearEquipos(groups: ClassGroup[], teams: WorkTeam[], initialGroupId: number | null, onSaved: () => void) {
    const { showToast } = useToast();
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(initialGroupId);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [teamName, setTeamName] = useState('');
    const [saving, setSaving] = useState(false);

    const group = groups.find((candidate) => candidate.id === selectedGroupId);
    const groupTeams = teams.filter((team) => team.group === selectedGroupId);
    const assignedStudentIds = new Set(groupTeams.flatMap((team) => team.members));
    const availableStudentIds = (group?.students ?? []).filter((studentId) => !assignedStudentIds.has(studentId));

    const selectGroup = (groupId: number | null) => {
        setSelectedGroupId(groupId);
        setSelectedMembers([]);
        setTeamName('');
    };

    const toggleMember = (studentId: number) => {
        setSelectedMembers((prev) => {
            if (prev.includes(studentId)) return prev.filter((memberId) => memberId !== studentId);
            if (prev.length >= MAX_TEAM_MEMBERS) {
                showToast(`Un equipo no puede tener más de ${MAX_TEAM_MEMBERS} integrantes.`, 'warning');
                return prev;
            }
            return [...prev, studentId];
        });
    };

    const saveTeam = async () => {
        if (!group) return;
        if (selectedMembers.length === 0) {
            showToast('Selecciona al menos un alumno.', 'warning');
            return;
        }
        setSaving(true);
        try {
            await academicService.createWorkTeam({
                name: teamName.trim() || `Equipo ${groupTeams.length + 1}`,
                group: group.id,
                members: selectedMembers,
            });
            showToast('Equipo creado.', 'success');
            setSelectedMembers([]);
            setTeamName('');
            onSaved();
        } catch (err) {
            showToast(getApiErrorMessage(err, 'No se pudo crear el equipo.'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const deleteTeam = async (teamId: number) => {
        try {
            await academicService.deleteWorkTeam(teamId);
            showToast('Equipo eliminado.', 'success');
            onSaved();
        } catch (err) {
            showToast(getApiErrorMessage(err, 'No se pudo eliminar el equipo.'), 'error');
        }
    };

    return {
        selectedGroupId, selectGroup, group, groupTeams, availableStudentIds,
        selectedMembers, toggleMember, teamName, setTeamName, saving, saveTeam, deleteTeam,
        nextTeamName: `Equipo ${groupTeams.length + 1}`,
    };
}

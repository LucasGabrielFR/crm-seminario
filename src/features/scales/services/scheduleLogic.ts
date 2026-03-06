
import { ScalePerson, ScaleRole, ScaleSchedule, ScaleWeek, ScaleDay, ScaleAssignment, ScaleSettings } from '../types';

const DAY_LABELS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const generateAutomaticScale = (
    allPeople: ScalePerson[],
    allRoles: ScaleRole[],
    settings: ScaleSettings,
    scheduleName: string
): ScaleSchedule => {
    const weeks: ScaleWeek[] = [];

    const people = allPeople.filter(p => settings.personIds.includes(p.id));
    const roles = allRoles.filter(r => settings.roleIds.includes(r.id));

    if (!scheduleName.trim()) throw new Error("O nome da escala é obrigatório.");
    if (people.length === 0) throw new Error("Selecione ao menos uma pessoa para a escala.");
    if (roles.length === 0) throw new Error("Selecione ao menos uma função para a escala.");
    if (settings.daysOfWeek.length === 0) throw new Error("Selecione ao menos um dia da semana.");

    const workload: Record<string, number> = {};

    people.forEach(p => workload[p.id] = 0);

    for (let wIdx = 0; wIdx < settings.durationWeeks; wIdx++) {
        const weekDays: ScaleDay[] = [];

        for (const dayIdx of settings.daysOfWeek) {
            const assignments: ScaleAssignment[] = [];

            roles.forEach(role => {
                const candidates = [...people].filter(p => {
                    // Rule: No multiple functions on the same day
                    const assignedToday = assignments.some(a => a.personId === p.id);
                    if (assignedToday) return false;

                    // Rule: No same function in the same week
                    for (const prevDay of weekDays) {
                        const hasRole = prevDay.assignments.some(a => a.roleId === role.id && a.personId === p.id);
                        if (hasRole) return false;
                    }

                    return true;
                });

                // Let's count assignments for each person THIS WEEK to maximize rotation
                const assignmentsThisWeek: Record<string, number> = {};
                people.forEach(p => assignmentsThisWeek[p.id] = 0);

                weekDays.forEach(d => {
                    d.assignments.forEach(a => {
                        assignmentsThisWeek[a.personId] = (assignmentsThisWeek[a.personId] || 0) + 1;
                    });
                });
                assignments.forEach(a => {
                    assignmentsThisWeek[a.personId] = (assignmentsThisWeek[a.personId] || 0) + 1;
                });

                candidates.sort((a, b) => {
                    const weekDiff = assignmentsThisWeek[a.id] - assignmentsThisWeek[b.id];
                    if (weekDiff !== 0) return weekDiff;

                    const workDiff = workload[a.id] - workload[b.id];
                    if (workDiff !== 0) return workDiff;

                    return Math.random() - 0.5;
                });

                if (candidates.length > 0) {
                    const selected = candidates[0];
                    assignments.push({ roleId: role.id, personId: selected.id });
                    workload[selected.id]++;
                } else {
                    // Fallback: relax "Same role per week" if strict list is empty
                    const relaxCandidates = [...people].filter(p => {
                        const assignedToday = assignments.some(a => a.personId === p.id);
                        return !assignedToday;
                    });

                    relaxCandidates.sort((a, b) => workload[a.id] - workload[b.id]);

                    if (relaxCandidates.length > 0) {
                        const selected = relaxCandidates[0];
                        assignments.push({ roleId: role.id, personId: selected.id });
                        workload[selected.id]++;
                    }
                }
            });

            weekDays.push({
                dayIndex: dayIdx,
                dayLabel: DAY_LABELS[dayIdx],
                assignments
            });
        }

        weeks.push({
            weekIndex: wIdx + 1,
            days: weekDays
        });
    }

    return {
        id: crypto.randomUUID(),
        name: scheduleName,
        weeks,
        createdAt: new Date().toISOString(),
        settings: { ...settings }
    };
};

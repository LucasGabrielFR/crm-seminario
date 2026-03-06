
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

    // Track total workload for lifetime balancing
    const workload: Record<string, number> = {};
    // Track when each person last did each role (week index)
    const lastRoleOccurrence: Record<string, Record<string, number>> = {};

    people.forEach(p => {
        workload[p.id] = 0;
        lastRoleOccurrence[p.id] = {};
        roles.forEach(r => lastRoleOccurrence[p.id][r.id] = -999);
    });

    for (let wIdx = 0; wIdx < settings.durationWeeks; wIdx++) {
        const weekDays: ScaleDay[] = [];

        for (const dayIdx of settings.daysOfWeek) {
            const assignments: ScaleAssignment[] = [];

            // Shuffle roles each day to avoid same priority order every time
            const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

            shuffledRoles.forEach(role => {
                // Potential candidates who haven't worked today and haven't done THIS role this week
                const candidates = [...people].filter(p => {
                    const assignedToday = assignments.some(a => a.personId === p.id);
                    if (assignedToday) return false;

                    const doneThisRoleThisWeek = weekDays.some(d =>
                        d.assignments.some(a => a.roleId === role.id && a.personId === p.id)
                    );
                    if (doneThisRoleThisWeek) return false;

                    return true;
                });

                // Sort candidates to maximize rotation
                candidates.sort((a, b) => {
                    // 1. Prefer someone who hasn't done this role in the longest time
                    const lastA = lastRoleOccurrence[a.id][role.id];
                    const lastB = lastRoleOccurrence[b.id][role.id];
                    if (lastA !== lastB) return lastA - lastB;

                    // 2. Prefer lower total workload
                    if (workload[a.id] !== workload[b.id]) return workload[a.id] - workload[b.id];

                    // 3. Random fallback
                    return Math.random() - 0.5;
                });

                if (candidates.length > 0) {
                    const selected = candidates[0];
                    assignments.push({ roleId: role.id, personId: selected.id });
                    workload[selected.id]++;
                    lastRoleOccurrence[selected.id][role.id] = wIdx;
                } else {
                    // Fallback: relax "same role this week" but still enforce "one role per day"
                    const fallbackCandidates = [...people].filter(p => {
                        const assignedToday = assignments.some(a => a.personId === p.id);
                        return !assignedToday;
                    });

                    fallbackCandidates.sort((a, b) => workload[a.id] - workload[b.id]);

                    if (fallbackCandidates.length > 0) {
                        const selected = fallbackCandidates[0];
                        assignments.push({ roleId: role.id, personId: selected.id });
                        workload[selected.id]++;
                        lastRoleOccurrence[selected.id][role.id] = wIdx;
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

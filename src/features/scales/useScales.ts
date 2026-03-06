
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { ScalePerson, ScaleRole, ScaleSchedule } from './types';
import { generateAutomaticScale } from './services/scheduleLogic';

export const useScalePeople = () => {
    return useQuery({
        queryKey: ['scale-people'],
        queryFn: async () => {
            const { data, error } = await supabase.from('scale_people').select('*').order('name');
            if (error) throw error;
            return data as ScalePerson[];
        }
    });
};

export const useUpsertScalePerson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (person: Partial<ScalePerson>) => {
            const { data, error } = await supabase.from('scale_people').upsert(person).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scale-people'] });
        }
    });
};

export const useDeleteScalePerson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('scale_people').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scale-people'] });
        }
    });
};

export const useScaleRoles = () => {
    return useQuery({
        queryKey: ['scale-roles'],
        queryFn: async () => {
            const { data, error } = await supabase.from('scale_roles').select('*').order('name');
            if (error) throw error;
            return data as ScaleRole[];
        }
    });
};

export const useUpsertScaleRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (role: Partial<ScaleRole>) => {
            const { data, error } = await supabase.from('scale_roles').upsert(role).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scale-roles'] });
        }
    });
};

export const useDeleteScaleRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('scale_roles').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scale-roles'] });
        }
    });
};

export const useScaleSchedules = () => {
    return useQuery({
        queryKey: ['scale-schedules'],
        queryFn: async () => {
            const { data, error } = await supabase.from('scale_schedules').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data.map(s => ({
                ...s,
                weeks: s.data,
                createdAt: s.created_at
            })) as ScaleSchedule[];
        }
    });
};

export const useCreateScaleSchedule = () => {
    const queryClient = useQueryClient();
    const { data: people } = useScalePeople();
    const { data: roles } = useScaleRoles();

    return useMutation({
        mutationFn: async ({ settings, name }: { settings: any, name: string }) => {
            if (!people || !roles) throw new Error("Dados não carregados");

            const created = generateAutomaticScale(people, roles, settings, name);

            const { weeks, createdAt, ...rest } = created;
            const dbPayload = {
                ...rest,
                data: weeks,
                created_at: createdAt
            };

            const { data, error } = await supabase.from('scale_schedules').insert([dbPayload]).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scale-schedules'] });
        }
    });
};

export const useUpdateScaleAssignment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ schedule, weekIdx, dayIdx, roleId, personId }: { schedule: ScaleSchedule, weekIdx: number, dayIdx: number, roleId: string, personId: string }) => {
            const newWeeks = [...schedule.weeks];
            const week = { ...newWeeks[weekIdx] };
            const day = { ...week.days[dayIdx] };
            const assignments = [...day.assignments];

            const idx = assignments.findIndex(a => a.roleId === roleId);
            if (idx >= 0) {
                assignments[idx] = { ...assignments[idx], personId };
            } else {
                assignments.push({ roleId, personId });
            }

            day.assignments = assignments;
            week.days[dayIdx] = day;
            newWeeks[weekIdx] = week;

            const { error } = await supabase.from('scale_schedules').update({ data: newWeeks }).eq('id', schedule.id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scale-schedules'] });
        }
    });
};

export const useDeleteScaleSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('scale_schedules').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scale-schedules'] });
        }
    });
};

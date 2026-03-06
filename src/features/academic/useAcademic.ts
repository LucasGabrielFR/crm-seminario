import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';

export type Course = Database['public']['Tables']['courses']['Row'];
export type Subject = Database['public']['Tables']['subjects']['Row'];

export type CourseWithSubjects = Course & {
    subjects: Subject[];
};

export type ClassType = Database['public']['Tables']['classes']['Row'];
export type Schedule = Database['public']['Tables']['class_schedules']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];

export type ClassWithDetails = ClassType & {
    subjects: { name: string; course_id: string } | null;
    profiles: { full_name: string } | null;
    class_schedules: Schedule[];
    enrollments: (Enrollment & { profiles: { full_name: string } | null })[];
};

export const useCourses = () => {
    return useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('courses')
                .select(`
          *,
          subjects (*)
        `)
                .order('name');

            if (error) throw error;
            return data as CourseWithSubjects[];
        },
    });
};

export const useUpsertCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (course: Partial<Course>) => {
            const { data, error } = await supabase
                .from('courses')
                .upsert(course)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });
};

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });
};

export const useUpsertSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (subject: Partial<Subject>) => {
            const { data, error } = await supabase
                .from('subjects')
                .upsert(subject)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });
};

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] });
        },
    });
};

export const useClasses = () => { return useQuery({ queryKey: ['classes'], queryFn: async () => { const { data, error } = await supabase.from('classes').select('*, subjects(name, course_id), profiles(full_name), class_schedules(*), enrollments(*, profiles(full_name))').order('created_at', { ascending: false }); if (error) throw error; return data as ClassWithDetails[]; }}); };

export const useUpsertClass = () => { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (classData: Partial<ClassType>) => { const { data, error } = await supabase.from('classes').upsert(classData).select().single(); if (error) throw error; return data; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['classes'] }); }}); };

export const useDeleteClass = () => { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from('classes').delete().eq('id', id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['classes'] }); }}); };

export const useUpsertSchedule = () => { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (schedule: Partial<Schedule>) => { const { data, error } = await supabase.from('class_schedules').upsert(schedule).select().single(); if (error) throw error; return data; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['classes'] }); }}); };

export const useDeleteSchedule = () => { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from('class_schedules').delete().eq('id', id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['classes'] }); }}); };

export const useUpsertEnrollment = () => { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (enrollment: Partial<Enrollment>) => { const { data, error } = await supabase.from('enrollments').upsert(enrollment).select().single(); if (error) throw error; return data; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['classes'] }); }}); };

export const useDeleteEnrollment = () => { const queryClient = useQueryClient(); return useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from('enrollments').delete().eq('id', id); if (error) throw error; }, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['classes'] }); }}); };

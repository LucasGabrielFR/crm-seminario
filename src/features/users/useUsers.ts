import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export interface Profile {
    id: string;
    full_name: string;
    email?: string;
    cpf?: string;
    role: 'admin' | 'formador' | 'seminarista' | 'professor';
    is_librarian?: boolean;
    stage_id: string | null;
    avatar_url: string | null;
    formative_stages?: {
        name: string;
    };
}

export interface FormativeStage {
    id: string;
    name: string;
    order: number;
}

export const useUsers = () => {
    return useQuery({
        queryKey: ['profiles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
          *,
          formative_stages(name)
        `)
                .order('full_name');

            if (error) throw error;
            return data as Profile[];
        },
    });
};

export const useFormativeStages = () => {
    return useQuery({
        queryKey: ['formative_stages'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('formative_stages')
                .select('*')
                .order('order');

            if (error) throw error;
            return data as FormativeStage[];
        },
    });
};

export const useUpsertProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: Partial<Profile>) => {
            const { data, error } = await supabase
                .from('profiles')
                .upsert(profile)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
        },
    });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export interface BookCategory {
    id: string;
    name: string;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string | null;
    total_quantity: number;
    available_quantity: number;
    location: string | null;
    cover_url: string | null;
    book_category_junction?: {
        category_id: string; // Added for easier editing
        book_categories: {
            name: string;
        };
    }[];
}

export interface BookRequest {
    id: string;
    book_id: string;
    user_id: string;
    status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
    request_date: string;
    response_date: string | null;
    notes: string | null;
    books?: {
        title: string;
        author: string;
    };
    profiles?: {
        full_name: string;
    };
}

export interface BookLoan {
    id: string;
    book_id: string;
    user_id: string | null;
    guest_name: string | null;
    loan_date: string;
    due_date: string;
    return_date: string | null;
    status: 'active' | 'returned' | 'overdue';
    books?: {
        title: string;
        author: string;
    };
    profiles?: {
        full_name: string;
    };
}

export const useBooks = () => {
    return useQuery({
        queryKey: ['books'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('books')
                .select('*, book_category_junction(book_categories(name))')
                .order('title');
            if (error) throw error;
            return data as Book[];
        },
    });
};

export const useBookCategories = () => {
    return useQuery({
        queryKey: ['book_categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('book_categories')
                .select('*')
                .order('name');
            if (error) throw error;
            return data as BookCategory[];
        },
    });
};

export const useBookLoans = () => {
    return useQuery({
        queryKey: ['book_loans'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('book_loans')
                .select('*, books(title, author), profiles(full_name)')
                .order('loan_date', { ascending: false });
            if (error) throw error;
            return data as BookLoan[];
        },
    });
};

export const useCreateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ categories, ...bookData }: Partial<Book> & { categories: string[] }) => {
            // 1. Create the book
            const { data: book, error: bookError } = await supabase
                .from('books')
                .insert(bookData)
                .select()
                .single();

            if (bookError) throw bookError;

            // 2. Create the junction records
            if (categories && categories.length > 0) {
                const junctionData = categories.map(catId => ({
                    book_id: book.id,
                    category_id: catId
                }));
                const { error: junctionError } = await supabase
                    .from('book_category_junction')
                    .insert(junctionData);

                if (junctionError) throw junctionError;
            }

            return book;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
    });
};

export const useCreateLoan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (loan: Partial<BookLoan>) => {
            const { data, error } = await supabase.from('book_loans').insert(loan).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['book_loans'] });
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
};

export const useReturnBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (loanId: string) => {
            const { data, error } = await supabase
                .from('book_loans')
                .update({ status: 'returned', return_date: new Date().toISOString() })
                .eq('id', loanId)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['book_loans'] });
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
};
export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (name: string) => {
            const { data, error } = await supabase
                .from('book_categories')
                .insert({ name })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['book_categories'] }),
    });
};
export const useUpdateBook = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, categories, ...bookData }: Partial<Book> & { categories: string[] }) => {
            // 1. Update the book
            const { data: book, error: bookError } = await supabase
                .from('books')
                .update(bookData)
                .eq('id', id)
                .select()
                .single();

            if (bookError) throw bookError;

            // 2. Sync categories
            if (categories) {
                // Delete old junctions
                const { error: deleteError } = await supabase
                    .from('book_category_junction')
                    .delete()
                    .eq('book_id', id);

                if (deleteError) throw deleteError;

                // Insert new ones
                if (categories.length > 0) {
                    const junctionData = categories.map(catId => ({
                        book_id: id,
                        category_id: catId
                    }));
                    const { error: insertError } = await supabase
                        .from('book_category_junction')
                        .insert(junctionData);

                    if (insertError) throw insertError;
                }
            }

            return book;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
    });
};

export const useBookRequests = () => {
    return useQuery({
        queryKey: ['book_requests'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('book_requests')
                .select('*, books(title, author), profiles(full_name)')
                .order('request_date', { ascending: false });
            if (error) throw error;
            return data as BookRequest[];
        },
    });
};

export const useCreateRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (request: Partial<BookRequest>) => {
            const { data, error } = await supabase
                .from('book_requests')
                .insert(request)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['book_requests'] }),
    });
};

export const useUpdateRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<BookRequest> & { id: string }) => {
            const { data, error } = await supabase
                .from('book_requests')
                .update({ ...updates, response_date: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['book_requests'] }),
    });
};

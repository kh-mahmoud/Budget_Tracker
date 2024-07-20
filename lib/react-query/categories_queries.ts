import { useMutation, useQuery, useQueryClient } from "react-query";
import { CreateCategory, DeleteCategory, GetCategories, GetProjectCategories } from "../actions/categories.action";
import { CreateCategoryProps } from "@/types";



export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ category, projectId }: { category: CreateCategoryProps, projectId: string }) =>
            CreateCategory(category, projectId),
        onSuccess: () => {
            queryClient.invalidateQueries('categories');
            queryClient.invalidateQueries('project_categories');

        },
    });
};


export const useGetCategories = (type: "income" | "expense") => {
    return useQuery(['categories', type], () => GetCategories(type));
};

export const useGetProjectCategories = (projectId: string, type: "income" | "expense") => {
    return useQuery(['project_categories', projectId, type], () => GetProjectCategories(projectId, type));
};


export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>DeleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries('categories');
            queryClient.invalidateQueries('project_categories');

        },
    });
};




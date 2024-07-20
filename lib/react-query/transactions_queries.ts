import { useMutation, useQuery, useQueryClient } from "react-query";
import { CreateTransaction, DeleteTrasanction, GetBalanceStats, GetCategoryStats, GetTrasanctions } from "../actions/transaction.action";
import { TransactionProps } from "@/types";



//create transaction
export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transaction: TransactionProps) => CreateTransaction(transaction),
        onSuccess: () => {
            queryClient.invalidateQueries('balance'),
            queryClient.invalidateQueries('categories_stats'),
            queryClient.invalidateQueries('year_period'),
            queryClient.invalidateQueries('transactions')
        },
    });
};





// get transaction balance
export const useGetBalance = (from: Date, to: Date, projectId: string) => {
    return useQuery(['balance', from, to, projectId], () => GetBalanceStats(from, to, projectId));
};


//get categories stats

export const useCategoriesStats = (from: Date, to: Date, projectId: string) => {

    return useQuery(['categories_stats', from, to, projectId], () => GetCategoryStats(from, to, projectId));

}


//get transactions

export const useGetTransactions = (from: Date, to: Date, projectId: string) => {

    return useQuery(['transactions', from, to, projectId], () => GetTrasanctions(from, to, projectId));

}


export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => DeleteTrasanction(id),
        onSuccess: () => {
            queryClient.invalidateQueries('balance'),
            queryClient.invalidateQueries('categories_stats'),
            queryClient.invalidateQueries('year_period'),
            queryClient.invalidateQueries('transactions')
        },
    });
};




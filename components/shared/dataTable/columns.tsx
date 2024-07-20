"use client"

import { $Enums, Currencies } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./column-header";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteTransaction } from "@/lib/react-query/transactions_queries";
import { toast } from "sonner";
import { useEffect } from "react";



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transactions = {
    id: string
    amount: number;
    description: string | null;
    date: Date;
    type: $Enums.Types;
    category: string;
    categoryIcon: string;
    currency: Currencies;
    permission: boolean
}



export const columns: ColumnDef<Transactions>[] = [

    {

        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex  gap-2 ">
                    {row.original.categoryIcon}
                    <div className="capitalize">{row.original.category}</div>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },


    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (<div className="capitalize">{row.original.description}</div>)
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (<div className="capitalize">{moment(row.original.date).format('DD/MM/YYYY')}</div>)
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },

        cell: ({ row }) => (
            <Badge className={`capitalize ${row.original.type === "income" ? 'bg-emerald-400/10 text-emerald-500' : 'bg-red-400/10 text-red-500'}`} variant="outline">
                <p>{row.original.type}</p>
            </Badge>
        )
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            <div className="flex gap-1">
                <span>{row.original.currency}</span>
                {row.original.amount}

            </div>
        )
    },
    {
        id: "actions",
        cell: ({ row }) => {

            const { mutate, isLoading } = useDeleteTransaction()

            useEffect(() => {


            }, [])

            const handleDelete = () => {
                toast.loading("Deleting", { id: "delete" })

                if (!row.original.permission) toast.error("you don't have the permission to delete this transaction", { id: "delete" })

                mutate(row.original.id, {
                    onSuccess: () => {
                        toast.success("Transaction has been deleted succefully", { id: "delete" })
                    },
                    onError: () => {
                        toast.error("something went wrong try later", { id: "delete" })
                    }
                })
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="flex gap-2 items-center"
                            onClick={handleDelete}
                        >
                            <Trash className="h-4 w-4" />
                            <p>Delete </p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

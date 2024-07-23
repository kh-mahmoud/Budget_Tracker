'use client'

import { useGetTransactions } from '@/lib/react-query/transactions_queries';
import { columns } from './dataTable/columns';
import SkeltonWrapper from './SkeltonWrapper';
import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    getPaginationRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,

} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,

} from "@/components/ui/table"
import { DataTableFacetedFilter } from './dataTable/data-table-faceted-filter';
import { DataTablePagination } from './dataTable/data-table-pagination';
import { DataTableVisibility } from './dataTable/column-visbility';
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Button } from '../ui/button';
import { DownloadIcon } from 'lucide-react';





const TransactionsTable = ({ from, to, projectId }: { from: Date, to: Date, projectId: string }) => {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const { data: transactions, isLoading } = useGetTransactions(from, to, projectId)
    const EmptyData: any[] = []

//using reduce function and map to create an array of unique categories

    const uniqueCategories = transactions?.reduce((accu, curr) => {
        const key = `${curr.category}-${curr.categoryIcon}`
        if (!accu.has(key)) {
            accu.set(key, { value: curr.category, label: `${curr.categoryIcon} ${curr.category}` })
        }

        return accu

    }, new Map());

    const uniqueCategoriesArray = uniqueCategories ? Array.from(uniqueCategories.values()) : [];

    const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true
    })

    const handleExportCsv = (data: any[]) => {
        const csv = generateCsv(csvConfig)(data)
        download(csvConfig)(csv)
    }


    const table = useReactTable({
        data: transactions || EmptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    const handleExportClick = () => {
        const data = table.getRowModel().rows.map((row) => (
            {
                category: String(row.original.category),
                categoryIcon: String(row.original.categoryIcon),
                description: String(row.original.description),
                amount: Number(row.original.amount),
                type: String(row.original.type),
                date: String(row.original.date),
                currency: String(row.original.currency)
            }
        ));
        handleExportCsv(data)
    }


    return (
        <div className='flex flex-col gap-4 mt-3'>
            <div className='flex justify-between items-center flex-wrap'>
                <div className='flex gap-3 flex-wrap items-center'>
                    {table.getColumn('category') && <DataTableFacetedFilter column={table.getColumn('category')} title="Category" options={uniqueCategoriesArray} />}
                    {table.getColumn('type') && <DataTableFacetedFilter column={table.getColumn('type')} title="Type" options={[{ label: "Income", value: "income" }, { label: "Expense", value: "expense" }]} />}
                </div>
                <div className='flex gap-3 flex-wrap items-center'>
                    <DataTableVisibility table={table} />
                    <Button onClick={handleExportClick} variant="outline" className="ml-auto flex gap-2">
                        <DownloadIcon className='h-4 w-4 ' />
                        <p>Export CSV</p>
                    </Button>
                </div>


            </div>

            <SkeltonWrapper isLoading={isLoading} className='h-[350px]'>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4">
                    <DataTablePagination table={table} />
                </div>
            </SkeltonWrapper>
        </div>
    );
}

export default TransactionsTable;

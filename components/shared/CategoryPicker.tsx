'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { GetCategories } from "@/lib/actions/categories.action";
import { Category } from "@prisma/client";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { CategoryForm } from "./forms/CategoryForm";
import { Loader2 } from "lucide-react";
import { useGetCategories } from "@/lib/react-query/categories_queries";


const CategoryPicker = ({ type, onChange }: { type: 'income' | 'expense', onChange: (value: string) => void }) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    
    const {data:categories,isLoading} = useGetCategories(type)

    // const initializeCategories = async () => {
    //     try {
    //         setLoading(true)
    //         const data = await GetCategories(type)

    //         if (data) {
    //             setCategories(data)
    //             setLoading(false)
    //         }

    //     } catch (error: any) {
    //         throw new Error(error)
    //         setLoading(false)
    //     }

    // }


    // useEffect(() => {
    //     initializeCategories()
    // }, [])



    const selectedCategory = categories?.find((category) => category?.name === value)

    useEffect(() => {
        if (!selectedCategory) return
        onChange(value ? selectedCategory?.name : "")
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    type="button"
                    className="w-[200px] justify-between flex items-center"
                >
                    {selectedCategory
                        ? <CategoryRow category={selectedCategory} />
                        : <p className="font-bold text-sm">Select category...</p>}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />

                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command onSubmit={(e) => e.preventDefault()}>
                    <CommandInput className="ml-1" placeholder="Search category..." />
                    <CategoryForm action={type} />
                    <CommandEmpty>No category found</CommandEmpty>
                    <CommandGroup>
                        <CommandList className="h-auto">
                            {isLoading ?
                                (<div className="flex h-10 justify-center items-center">
                                    <Loader2 className="animate-spin" />
                                </div>) :
                                (categories && categories.map((category) => (
                                    <CommandItem
                                        key={category.userId}
                                        value={category.name}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <CategoryRow category={category} />

                                    </CommandItem>
                                )))
                            }
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover >
    );
}

export default CategoryPicker;


const CategoryRow = ({ category }: { category: Category }) => (

    <div className="flex items-center gap-2">
        <span>{category.icon}</span>
        <span>{category.name}</span>
    </div>

)

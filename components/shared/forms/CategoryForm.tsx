"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { categorySchema } from "@/lib/validation/category"
import { CircleOff, PlusSquare } from "lucide-react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTheme } from "next-themes"
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from "react"
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog"
import { CreateCategory } from "@/lib/actions/categories.action"
import { useParams } from "next/navigation"
import { Category } from "@prisma/client"
import { useCreateCategory } from "@/lib/react-query/categories_queries"


export function CategoryForm({ action, children }: { action: 'income' | 'expense', children?: ReactNode }) {


    const { theme } = useTheme()
    const closeEmoji = useRef<HTMLButtonElement | null>(null)
    const closeModal = useRef<HTMLButtonElement | null>(null)
    const [loading, setLoading] = useState(false)
    const { id } = useParams();
    const projectId = Array.isArray(id) ? id[0] : id;

    const { mutate, isLoading } = useCreateCategory()


    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            icon: "",
        },
    })


    async function onSubmit(values: z.infer<typeof categorySchema>) {
        try {

            const newCategory = {
                ...values,
                type: action
            };

            mutate(
                { category: newCategory, projectId },
                {
                    onSuccess: (category) => {
                        closeModal.current?.click();
                        form.reset();
                    },
                    onError: (error) => {
                        console.log(error);
                    }
                }
            );
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button variant={"ghost"} className="text-muted-foreground flex justify-start items-center rounded-none px-2 gap-x-2 border-b">
                        <PlusSquare />
                        Create new
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-md">
                <DialogHeader>
                    <DialogTitle>
                        create&nbsp;<span className={`${action == "income" ? "text-emerald-500" : "text-red-500"}`}>{action}</span>&nbsp; category
                    </DialogTitle>
                    <DialogDescription>
                        Categories are used to group your transactions
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            e.stopPropagation();
                            e.preventDefault();  // Prevent the default form submission
                            form.handleSubmit(onSubmit)(e);
                        }}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input className="custom_input" placeholder="name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button ref={closeEmoji} variant="outline" className="w-full h-[110px] gap-y-3">
                                                    {form.watch('icon') ?
                                                        (<div className="flex flex-col text-muted-foreground justify-center items-center gap-y-5">
                                                            <div className="w-32 scale-[3]  " >{field.value}</div>
                                                            <p>Click to change</p>
                                                        </div>)
                                                        :
                                                        (<div className="flex flex-col text-muted-foreground justify-center items-center gap-y-3">
                                                            <CircleOff className="h-[48px] w-[48px]" />
                                                            <p>Click to select</p>
                                                        </div>)
                                                    }
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full translate-y-56  transition-opacity">
                                                <Picker
                                                    theme={theme}
                                                    data={data}
                                                    onEmojiSelect={(emoji: { native: string }) => {
                                                        field.onChange(emoji.native)
                                                        closeEmoji?.current?.click()
                                                    }} />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col w-full gap-2">
                            <Button disabled={isLoading} type="submit">{loading ? 'saving...' : 'Save'}</Button>
                            <Button type="button" onClick={() => closeModal.current?.click()} variant="secondary">Cancel</Button>
                        </div>

                    </form>
                </Form>
                <DialogClose asChild>
                    <Button className="hidden" ref={closeModal} type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

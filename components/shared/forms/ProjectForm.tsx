'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { projectSchema } from "@/lib/validation/project";
import { Textarea } from "@/components/ui/textarea";
import { CreateProject, UpdateProject } from "@/lib/actions/project.actions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { ReactNode, useRef, useState } from "react";
import { toast } from 'sonner';
import { ProjectProps } from "@/types";
import { defaultValues } from "@/constants";

type ProjectFormProps = {
    userId?: string;
    action: "create" | "update";
    orgId?: string;
    data?: ProjectProps | null;
    children?: ReactNode;
    open?: boolean;
    onClose?: () => void;
};

export function ProjectForm({ children, onClose, userId, action, orgId, data = null, open }: ProjectFormProps) {
    const close = useRef<HTMLButtonElement | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: data && action === "update" ?
            {
                title: data?.title,
                description: data?.description ?? "",
            } :
            defaultValues,
    });

    async function onSubmit(values: z.infer<typeof projectSchema>) {
        if (action == "create") {
            try {
                setIsLoading(true);
                const newProject = await CreateProject({ project: values, orgId, userId });

                if (newProject) {
                    setIsLoading(false);
                    close.current?.click();
                    form.reset();
                    toast.success("Project has been created successfully", { duration: 3000 });
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
                close.current?.click();
                toast.error("Sorry, something went wrong. Try later", { duration: 3000 });
            }
        }

          if (action == "update") {
            try {
                if(!data) return
                setIsLoading(true);
                const updateProject = await UpdateProject({id:data.id,project: values});

                if (updateProject ) {
                    setIsLoading(false);
                    close.current?.click();
                    form.reset();
                    toast.success("Project has been updated successfully", { duration: 3000 });
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
                close.current?.click();
                toast.error("Sorry, something went wrong. Try later", { duration: 3000 });
            }
        }
        
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-full flex flex-col items-start rounded-md">
                <DialogHeader>
                    <DialogTitle className="flex justify-start">{action === "update" ? "Update Project" : "New Project"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input className={"custom_input"} placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea className={"custom_input"} placeholder="Description" {...field} value={field.value ?? ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={isLoading} type="submit">
                            {action === "create"
                                ? (isLoading ? "Creating..." : "Create")
                                : (isLoading ? "Updating..." : "Update")
                            }
                        </Button>


                        <DialogClose className="hidden" asChild>
                            <Button ref={close} type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

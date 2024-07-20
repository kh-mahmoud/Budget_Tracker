'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useState } from "react";
import { ProjectForm } from "./forms/ProjectForm";
import { ProjectProps } from "@/types";
import { DeleteProject } from "@/lib/actions/project.actions";
import { toast } from "sonner";

const DropMenu = ({ children, project }: { children: ReactNode, project: ProjectProps }) => {
    const [open, setOpen] = useState(false);

    const handleUpdateClick = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleDelete = async (id: string) => {

        toast.loading("Deleting", { id: "delete" });
        const deleteProject = await DeleteProject(id)
        if (deleteProject) toast.success("Project has been deleted successfully", { id: "delete", duration: 3000 });

    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent
              
                >
                    <DropdownMenuItem onClick={handleUpdateClick}>Update</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(project.id)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {open && (
                <ProjectForm open={open} data={project} action={"update"} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default DropMenu;

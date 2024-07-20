'use server'

import { revalidatePath } from "next/cache"
import { prisma } from "../prismaClient"
import { CreateProjectProps, UpdateProjectProps } from "@/types"
import { auth } from "@clerk/nextjs/server"


export const CreateProject = async ({ project, orgId, userId }: CreateProjectProps) => {
    try {
        const author = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } })

        if (orgId) {
            const group = await prisma.group.findUnique({ where: { OrgId: orgId }, select: { id: true } })
            const newProject = await prisma.project.create({
                data: {
                    ...project,
                    OrgId: orgId,
                    creator: { connect: { id: author?.id } },
                    group: { connect: { id: group?.id } }
                }
            })
            revalidatePath("/")
            return newProject
        }

        const newProject = await prisma.project.create({
            data: {
                ...project,
                creator: { connect: { id: author?.id } },
            }
        })
        revalidatePath("/")
        return newProject
    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }


}



export const GetProjects = async (id: string) => {
    try {
        const { userId, orgId } = auth()

        if (orgId) {

            const projects = await prisma.project.findMany({ where: { groupId: { not: null }, OrgId: orgId }, include: { group: { include: { members: true } }, creator: true }, orderBy: { updatedAt: "desc" } })

            return projects
        }

        const projects = await prisma.project.findMany({ where: { group: null, userId: id }, include: { creator: true, group: { include: { members: true } } }, orderBy: { updatedAt: "desc" } })

        return projects


    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();
    }
}


export const UpdateProject = async ({ id, project }: UpdateProjectProps) => {

    try {
        const updatedProject = await prisma.project.update({
            where: { id },
            data: project
        })

        revalidatePath("/")
        return updatedProject

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}


export const DeleteProject = async (id: string) => {

    try {
        const deletedProject = await prisma.project.delete({
            where: { id }
        })

        revalidatePath("/")

        return deletedProject

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}

export const GetProjectById = async (id: string) => {
    try {
        const project = await prisma.project.findUnique({ where: { id },include:{creator:true} })
        
        if(!project) throw new Error("project not found")


        return project

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }

}

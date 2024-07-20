'use server'

import { Types } from "@prisma/client";
import { prisma } from "../prismaClient";
import { auth } from "@clerk/nextjs/server";
import { CreateCategoryProps } from "@/types";
import { ClauseBuilder } from "./clausseBuilder.action";




export const GetCategories = async (type: Types) => {
    try {
        const categories = await prisma.category.findMany({ where: { type } })

        return categories
    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}



export const CreateCategory = async (category: CreateCategoryProps, projectId: string) => {
    try {
        const { userId } = auth()
        if (!userId) throw new Error("user not found")

        const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } })
        if (!user) throw new Error("user not found")


        const newCategory = await prisma.category.create({
            data: {
                ...category,
                userId: user?.id,
                projectId
            }
        })
        return newCategory

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}


export const GetProjectCategories = async (projectId: string, type: 'income' | 'expense') => {

    try {
        const { userId, orgId } = auth();
        if (!userId) throw new Error("user not found");

        const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } });
        if (!user) throw new Error("user not found");

        const { whereClause } = await ClauseBuilder(projectId, user.id, orgId);

        const categories = await prisma.category.findMany({
            where: {
                ...whereClause,
                type,
                projectId
            }
        });

        return categories;

    } catch (error) {
        console.log(error);
        return [];
    } finally {
        await prisma.$disconnect();
    }

}


export const DeleteCategory = async (id: string) => {

    try {

        const deletedCategory = await prisma.category.delete({ where: { id } })

        return deletedCategory



    } catch (error) {
        console.log(error);
        return [];
    } finally {
        await prisma.$disconnect();
    }

}

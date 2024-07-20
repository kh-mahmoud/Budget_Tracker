'use server'


import { CreateUserParams, UpdateUserParams } from "@/types"
import { prisma } from "../prismaClient"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { Currencies } from "@prisma/client"
import { revalidatePath } from "next/cache"



//create users

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await prisma.user.create({ data: user })

        if (!newUser) redirect("/sign-in")

        return newUser

    } catch (error) {
        console.log(error)
    } finally {
        await prisma.$disconnect();

    }

}


//update users

export const updateUser = async (user : UpdateUserParams,id:string) => {

    try {

        const updatedUser = await prisma.user.update({ where: { clerkId: id }, data: user })

        if (!updatedUser) throw new Error("User not found")

        return updatedUser
    } catch (error) {
        console.log(error)

    } finally {
        await prisma.$disconnect();

    }
}

//delete user

export const deleteUser = async (id: string) => {


    try {
        const deletedUser = await prisma.user.delete({ where: { clerkId: id } })
        if (!deletedUser) throw new Error("User not found")
        return deletedUser
    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}

//get user by id

export const getUserById = async () => {
    try {
        const { userId } = auth()
        if (!userId) redirect("/sign-in")

        const user = await prisma.user.findUnique({ where: { clerkId: userId } })
        if (!user) throw new Error("User not found")
        return user
    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }

}


export const updateUserCurrency = async (currency: Currencies | undefined) => {

    try {
        const { userId } = auth()
        if (!userId) redirect("/sign-in")


        const updatedUser = await prisma.user.update({ where: { clerkId: userId }, data: { currency } })

        if (!updatedUser) throw new Error("User not found")

        revalidatePath("/")
        return updatedUser

    } catch (error) {
        console.log(error)

    } finally {
        await prisma.$disconnect();

    }
}
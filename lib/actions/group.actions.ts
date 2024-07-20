'use server'

import { revalidatePath } from "next/cache"
import { prisma } from "../prismaClient"
import { CreateOrganizationParams, UpdateOrganizationParams } from "@/types"
import { updateUser } from "./user.actions"




//create group

export const CreateGroup = async (group: CreateOrganizationParams, ownerId: string) => {
    try {
        const userId = await prisma.user.findUnique({ where: { clerkId: ownerId }, select: { id: true } })

        if (!userId) throw new Error("user not found")

        const newGroup = await prisma.group.create({
            data: {
                ...group,
                owners: { connect: { id: userId.id } },
                members: { connect: { id: userId.id } }
            }
        })

        if (newGroup) await prisma.user.update({
            where: { clerkId: ownerId }, data: {
                role: "org:admin"
            }
        })


        revalidatePath('/')
        return newGroup

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}


//update group

export const UpdateGroup = async (group: UpdateOrganizationParams, id: string) => {
    try {
        const updateGroup = await prisma.group.update({ where: { OrgId: id }, data: group })
        revalidatePath('/')

        return updateGroup

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}


//delete group

export const DeleteGroup = async (OrgId: string) => {
    try {
        // Step 1: Fetch the group along with its members and owners
        const group = await prisma.group.findUnique({
            where: { OrgId },
            include: {
                owners: { select: { id: true } },
                members: { select: { id: true } },
            },
        });

        if (!group) {
            throw new Error('Group not found');
        }

        // Step 2: Collect the IDs of all members and owners
        const ownerIds = group.owners.map((owner) => owner.id);
        const memberIds = group.members.map((member) => member.id);

        // Step 3: Disconnect the owners and members from the group
        await prisma.group.update({
            where: { OrgId },
            data: {
                owners: {
                    disconnect: ownerIds.map((ownerId) => ({ id: ownerId })),
                },
                members: {
                    disconnect: memberIds.map((memberId) => ({ id: memberId })),
                },
            },
        });

        const deleteGroup = await prisma.group.delete({ where: { OrgId } })



        revalidatePath('/')


        return deleteGroup

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}

//add member

export const AddToGroup = async (groupId: string, memberId: string, role: string) => {
    try {
        const userId = await prisma.user.findUnique({ where: { clerkId: memberId }, select: { id: true } })

        if (!userId) throw new Error("user not found")

        const newMember = await prisma.group.update({
            where: { OrgId: groupId },
            data: {
                members: { connect: { id: userId.id } }
            }
        })

        if (newMember) await updateUser({ role }, memberId);


        if (role === "org:admin") {
            await prisma.group.update({
                where: { OrgId: groupId },
                data: {
                    owners: { connect: { id: userId.id } }
                }
            })
        }

        return newMember

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}

//update member

export const UpdateGroupMember = async (role: string, memberId: string, OrgId: string) => {
    try {

        const user = await prisma.user.findUnique({ where: { clerkId: memberId }, select: { id: true } })

        await updateUser({ role }, memberId)

        if (role === "org:member") {
            await prisma.group.update({
                where: { OrgId }, data: {
                    owners: { disconnect: { id: user?.id } }
                }
            })
        }
        else {
            await prisma.group.update({
                where: { OrgId }, data: {
                    owners: { connect: { id: user?.id } }
                }
            })
        }

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}

//delete member

export const RemoveFromGroup = async (groupId: string, memberId: string, role: string) => {
    try {
        const userId = await prisma.user.findUnique({ where: { clerkId: memberId }, select: { id: true } })

        if (!userId) throw new Error("user not found")

        const deletedMember = await prisma.group.update({
            where: { OrgId: groupId },
            data: {
                members: { disconnect: { id: userId.id } }
            }
        })

        if (role === "org:admin") {
            await prisma.group.update({
                where: { OrgId: groupId },
                data: {
                    owners: { disconnect: { id: userId.id } }
                }
            })
        }


        return deletedMember

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }
}


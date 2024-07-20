'use server'

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prismaClient";
import { TransactionProps } from "@/types";
import { ClauseBuilder } from "./clausseBuilder.action";
import { Currencies } from "@/constants";





export const CreateTransaction = async (transaction: TransactionProps) => {

    try {
        const { date, amount, category, type, projectId } = transaction

        const { userId } = auth()
        if (!userId) throw new Error("user not found")

        const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } })
        if (!user) throw new Error("user not found")

        const Category = await prisma.category.findFirst({ where: { name: category } })
        if (!Category) throw new Error("category not found")

        const project = await prisma.project.findUnique({ where: { id: projectId } })
        if (!project) throw new Error("project not found")

        const newTransaction = await prisma.$transaction([

            prisma.transaction.create({
                data: {
                    ...transaction,
                    userId: user.id,
                    categoryIcon: Category.icon,
                }
            }),

            prisma.monthHistory.upsert({
                where: {
                    day_month_year_userId: {
                        userId: user.id,
                        day: date.getUTCDate(),
                        month: date.getUTCMonth() + 1,
                        year: date.getUTCFullYear()
                    }
                },
                create: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth() + 1,
                    year: date.getUTCFullYear(),
                    income: type === "income" ? amount : 0,
                    expense: type === "expense" ? amount : 0,
                    projectId
                },
                update: {
                    expense: {
                        increment: type === "expense" ? amount : 0
                    },
                    income: {
                        increment: type === "income" ? amount : 0
                    }
                }
            }),

            prisma.yearHistory.upsert({
                where: {
                    month_year_userId: {
                        userId: user.id,
                        month: date.getUTCMonth(),
                        year: date.getUTCFullYear()
                    }
                },
                create: {
                    userId: user.id,
                    month: date.getUTCMonth() + 1,
                    year: date.getUTCFullYear(),
                    income: type === "income" ? amount : 0,
                    expense: type === "expense" ? amount : 0,
                    projectId
                },
                update: {
                    expense: {
                        increment: type === "expense" ? amount : 0
                    },
                    income: {
                        increment: type === "income" ? amount : 0
                    }
                }
            })
        ])

        return newTransaction

    } catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect();

    }

}

export const GetBalanceStats = async (from: Date, to: Date, projectId: string) => {
    try {
        const { userId, orgId } = auth();
        if (!userId) throw new Error("user not found");

        const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } });
        if (!user) throw new Error("user not found");

        const { whereClause } = await ClauseBuilder(projectId, user.id, orgId);

        const transaction = await prisma.transaction.groupBy({
            by: ['type'],
            where: {
                ...whereClause,
                projectId,
                date: {
                    gte: from,
                    lte: to
                }
            },
            _sum: {
                amount: true
            }
        });

        return {
            expense: transaction.find((t) => t.type === "expense")?._sum.amount || 0,
            income: transaction.find((t) => t.type === "income")?._sum.amount || 0
        };
    } catch (error) {
        console.log(error);
    } finally {
        await prisma.$disconnect();
    }
};

export const GetCategoryStats = async (from: Date, to: Date, projectId: string) => {
    try {
        const { userId, orgId } = auth();
        if (!userId) throw new Error("user not found");

        const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } });
        if (!user) throw new Error("user not found");

        const { whereClause } = await ClauseBuilder(projectId, user.id, orgId);

        const stats = await prisma.transaction.groupBy({
            by: ['type', 'category', 'categoryIcon'],
            where: {
                ...whereClause,
                projectId,
                date: {
                    gte: from,
                    lte: to
                }
            },
            _sum: {
                amount: true
            },
            orderBy: {
                _sum: {
                    amount: "desc"
                }
            }
        });

        return stats;
    } catch (error) {
        console.log(error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
};

export const GetTrasanctions = async (from: Date, to: Date, projectId: string,) => {
    try {
        const { userId, orgId } = auth();
        if (!userId) throw new Error("user not found");

        const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true, currency: true, role: true } });
        if (!user) throw new Error("user not found");

        const project = await prisma.project.findUnique({ where: { id: projectId }, include: { creator: true } })
        if (!project) throw new Error("project not found")

        const permission = user.role === "org:admin" || project.creator.id === user.id


        const { whereClause } = await ClauseBuilder(projectId, user.id, orgId);

        const transactions = await prisma.transaction.findMany({
            where: {
                ...whereClause,
                projectId,
                date: {
                    gte: from,
                    lte: to
                }
            },
            orderBy: { date: "desc" }
        })

        if (transactions.length <= 0) return []

        return transactions.map((transaction) => (
            {
                ...transaction,
                currency: orgId ? Currencies.find((currency) => project.creator.currency === currency.value)?.label : Currencies.find((currency) => user.currency === currency.value)?.label,
                permission
            }))



    } catch (error) {
        console.log(error);
        return [];
    } finally {
        await prisma.$disconnect();
    }

}


export const DeleteTrasanction = async (id: string) => {
    try {
        const deletedTransaction = await prisma.transaction.delete({ where: { id } })

        return deletedTransaction

    } catch (error) {
        console.log(error);
        return [];
    } finally {
        await prisma.$disconnect();
    }

}














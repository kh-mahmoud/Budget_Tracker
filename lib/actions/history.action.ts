'use server'

import { auth } from "@clerk/nextjs/server"
import { prisma } from "../prismaClient"
import { Period, TimeFrame } from "@/types"
import { ClauseBuilder } from "./clausseBuilder.action";
import { months, Year_months } from "@/constants";
import { getDaysInMonth } from "date-fns";




export const GetYearPeriods = async (projectId: string) => {
    try {
        const { userId, orgId } = auth();
        if (!userId) throw new Error("user not found");

        const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } });
        if (!user) throw new Error("user not found");

        const { whereClause } = await ClauseBuilder(projectId, user.id, orgId);

        const history = await prisma.monthHistory.findMany({
            where: {
                ...whereClause,
                projectId
            },
            select: {
                year: true
            },
            distinct: ["year"],
            orderBy: {
                year: "asc"
            }
        });

        const years = history.map((item) => item.year);

        return years;
    } catch (error) {
        console.log(error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
};


export const GetHistoryData = async (projectId: string, timeFrame: TimeFrame, period: Period) => {
    try {

        const { userId, orgId } = auth()
        if (!userId) throw new Error("user not found")

        const user = await prisma.user.findUnique({ where: { clerkId: userId }, select: { id: true } })
        if (!user) throw new Error("user not found")

        const year = period.year
        const month = period.month

        switch (timeFrame) {

            case ("year"):
                return await GetYearData(projectId, user.id, orgId, year)

            case ("month"):
                return await GetMonthData(projectId, user.id, orgId, year, month)

            default:
                throw new Error(`Unsupported timeFrame: ${timeFrame}`);
        }


    } catch (error) {
        console.log(error)
    } finally {
        await prisma.$disconnect();

    }


}


export const GetYearData = async (projectId: string, userId: string, orgId: string | undefined, year: number) => {
    try {

        const { whereClause } = await ClauseBuilder(projectId, userId, orgId);

        const yearData = await prisma.yearHistory.groupBy({
            by: ['month'],
            where: {
                ...whereClause,
                projectId,
                year
            },
            _sum: {
                income: true,
                expense: true
            },
            orderBy: {
                month: "asc"
            }
        })

        if (!yearData || yearData.length === 0) return []

        const yearHistory = []

        // list of data for each month
        for (let i of Year_months) {
            let income = 0
            let expense = 0

            const month = yearData.find((item) => item.month === i.value)
            if (month) {
                income = month._sum.income || 0;
                expense = month._sum.expense || 0;
            }

            yearHistory.push({
                month: i.value,
                expense,
                income,
                year
            })
        }


        return yearHistory

    } catch (error) {
        console.log(error)
    } finally {
        await prisma.$disconnect();

    }


}


export const GetMonthData = async (projectId: string, userId: string, orgId: string | undefined, year: number, month: number) => {
    try {
        const { whereClause } = await ClauseBuilder(projectId, userId, orgId);
        const monthData = await prisma.monthHistory.groupBy({
            by: ['day'],
            where: {
                ...whereClause,
                projectId,
                year,
                month: month + 1
            },
            _sum: {
                income: true,
                expense: true
            },
            orderBy: {
                day: "asc"
            }
        })

        if (!monthData || monthData.length === 0) return []

        const monthHistory = []
        const daysInMonth = getDaysInMonth(new Date(year, month))

        // list of data for each day in the month

        for (let i = 0; i <= daysInMonth; i++) {
            let income = 0
            let expense = 0

            const day = monthData.find((item) => item.day === i)
            if (day) {
                income = day._sum.income || 0;
                expense = day._sum.expense || 0;
            }

            monthHistory.push({
                month,
                expense,
                income,
                year,
                day: i
            })
        }


        return monthHistory




    } catch (error) {
        console.log(error)
    } finally {
        await prisma.$disconnect();

    }


}
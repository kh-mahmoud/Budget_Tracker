import { User, Currencies, $Enums } from "@prisma/client"
import { ReactNode } from "react";



export type CreateUserParams = {
    clerkId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
    currency: Currencies | undefined;
};

export type UpdateUserParams = {

    username?: string,
    firstName?: string,
    lastName?: string,
    photo?: string,
    role?: string


}


export type CreateOrganizationParams = {
    name: string
    OrgId: string
    slug: string
    image: string | undefined
}



export type UpdateOrganizationParams = {
    name: string
    slug: string
    image: string | undefined
}

export type CreateProjectProps =
    {
        project: {
            title: string
            description: string | null
        }
        orgId?: string
        userId: string | undefined

    }

export type UpdateProjectProps =
    {
        project: {
            title: string
            description: string | null
        }
        id: string

    }

export type CreateCategoryProps =
    {
        name: string,
        icon: string,
        type: "income" | "expense"

    }


type Group = {
    id: string;
    name: string;
    OrgId: string | null;
    members: User[];
}

export type ProjectProps =
    {
        id: string;
        OrgId: string | null;
        title: string;
        description: string | null;
        creator: User
        group: Group | null
        createdAt: Date;
    }

export type TransactionProps = {
    amount: number;
    description?: string;
    date: Date;
    type: $Enums.Types;
    category: string;
    projectId: string
}

export type statsCardsProps = {
    from: Date,
    to: Date
    projectId: string
    user: User
}

export type StatsCardProps = {
    value: number,
    title: string,
    icon: ReactNode,
    currency: Currencies

}
export type CategoriesCardProps = {
    type: "income" | "expense";
    currency: Currencies
    data?: {
        _sum: {
            amount: number | null;
        };
        type: string;
        category: string;
        categoryIcon: string;
    }[]
};


export type TimeFrame = "month" | "year";

export type Period = {
    month: number;
    year: number;
}

export type PeriodSelectorProps = {

    projectId: string;
    period: Period
    timeFrame: TimeFrame;
    setTimeFrame: React.Dispatch<React.SetStateAction<TimeFrame>>;
    setPeriod: React.Dispatch<React.SetStateAction<Period>>;
}

export type YearSelectorProps = {

    period: Period
    setPeriod: React.Dispatch<React.SetStateAction<Period>>
    years: number[] | undefined
    isLoading: boolean

}

export type MonthSelectorProps = {

    period: Period
    setPeriod: React.Dispatch<React.SetStateAction<Period>>
    isLoading: boolean
}

export type ChartsProps = {

    historyData: {
        month: number
        expense: number;
        income: number;
        year: number;
    }[] | {
        month: number;
        expense: number;
        income: number;
        year: number;
        day: number;
    }[] | undefined

    timeFrame: TimeFrame;
    currency: Currencies
}


export type CategoriesManagerProps = {
    permission: boolean
    title: string
    subtitle: string
    icon: ReactNode
    type: 'income' | 'expense'
    projectId: string

}
















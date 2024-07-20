'use client'

import Header from './Header';
import { DateRangePicker } from '../ui/date-range-picker';
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from 'react';
import { toast } from 'sonner';
import { MAX_DATE_RANGE_DAYS, toUTC } from '@/lib/utils';
import { Currencies } from '@prisma/client';
import StatsCard from './StatsCard';
import SkeltonWrapper from './SkeltonWrapper';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useCategoriesStats, useGetBalance } from '@/lib/react-query/transactions_queries';
import CategoriesCard from './CategoriesCard';





const Overview = ({ projectId, currency }: { projectId: string, currency: Currencies }) => {
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()),
        to: new Date(),
    });


    const { data: Balance, isLoading } = useGetBalance(dateRange.from, dateRange.to, projectId)
    const { data: categories, isLoading: categoriesFetch } = useCategoriesStats(dateRange.from, dateRange.to, projectId)

    const balance = Balance ? (Balance?.income - Balance?.expense) : 0




    return (
        <div className='container flex flex-col gap-3'>

            {/*overview Header*/}
            <div className='flex flex-wrap gap-2 justify-between items-center'>
                <Header title='Overview' />
                <div>
                    <DateRangePicker
                        initialDateFrom={dateRange.from}
                        initialDateTo={dateRange.to}
                        showCompare={false}
                        onUpdate={(values) => {
                            const { from, to } = values.range;

                            // Check if both dates are set
                            if (!from || !to) return;

                            // Convert dates to UTC
                            const utcFrom = toUTC(from);
                            const utcTo = toUTC(to);

                            // Check if the date range is within allowed days
                            if (differenceInDays(utcTo, utcFrom) > MAX_DATE_RANGE_DAYS) {
                                toast.error(`The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`);
                                return;
                            }

                            // Update the state with UTC dates
                            setDateRange({ from: utcFrom, to: utcTo });
                        }}
                    />

                </div>
            </div>

            {/*Balance Stats*/}
            <div className='flex flex-wrap w-full gap-3'>
                <SkeltonWrapper className='flex-1' isLoading={isLoading}>
                    <StatsCard
                        value={Balance?.income || 0}
                        title={"Income"}
                        icon={
                            <TrendingUp className='h-12 w-12 bg-emerald-400/10 text-emerald-500 p-1 rounded-md' />
                        }
                        currency={currency}
                    />
                </SkeltonWrapper>

                <SkeltonWrapper className='flex-1' isLoading={isLoading}>
                    <StatsCard
                        value={Balance?.expense || 0}
                        title={"Expense"}
                        icon={
                            <TrendingDown className='h-12 w-12 bg-rose-400/10 text-rose-500 p-1 rounded-md' />
                        }
                        currency={currency}
                    />
                </SkeltonWrapper>

                <SkeltonWrapper className='flex-1' isLoading={isLoading}>
                    <StatsCard
                        value={balance}
                        title={"Balance"}
                        icon={
                            <Wallet className='h-12 w-12 bg-violet-400/10 text-violet-500 p-1 rounded-md' />
                        }
                        currency={currency}
                    />
                </SkeltonWrapper>
            </div>

            {/*Categories Stats*/}

            <div className='flex-wrap grid grid-cols-2 max-md:grid-cols-1 gap-3 '>

                <SkeltonWrapper className='flex-1 h-80' isLoading={categoriesFetch}>
                    <CategoriesCard
                        type="income"
                        data={categories}
                        currency={currency}
                    />
                </SkeltonWrapper>

                <SkeltonWrapper className='flex-1 h-80' isLoading={categoriesFetch}>
                    <CategoriesCard
                        type="expense"
                        data={categories}
                        currency={currency}

                    />
                </SkeltonWrapper>
            </div>

        </div>
    );
}

export default Overview;

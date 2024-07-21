'use client'

import { useGetYearPeriods } from "@/lib/react-query/history_queries";
import SkeltonWrapper from "./SkeltonWrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeriodSelectorProps, TimeFrame } from "@/types";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";



const PeriodSelector = ({ period, setPeriod, timeFrame, setTimeFrame, projectId }: PeriodSelectorProps) => {


    const { data: years, isLoading } = useGetYearPeriods(projectId)




    return (
        <div className="flex justify-between gap-5 flex-wrap max-md:w-full">

            <SkeltonWrapper isLoading={isLoading}>
                <Tabs onValueChange={(value) => setTimeFrame(value as TimeFrame)} value={timeFrame} >

                    <TabsList>
                        <TabsTrigger value="year">Year</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>

                </Tabs>
            </SkeltonWrapper>

            <div className="flex gap-3 flex-wrap ">
                <SkeltonWrapper isLoading={isLoading}>
                    <YearSelector isLoading={isLoading} period={period} years={years} setPeriod={setPeriod} />
                </SkeltonWrapper>

                {timeFrame === "month" &&
                    <SkeltonWrapper isLoading={isLoading}>
                        <MonthSelector isLoading={isLoading} period={period} setPeriod={setPeriod} />
                    </SkeltonWrapper>
                }

            </div>


        </div>
    );
}

export default PeriodSelector;

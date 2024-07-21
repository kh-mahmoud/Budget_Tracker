'use client'

import { useState } from "react";
import Header from "./Header";
import PeriodSelector from "./PeriodSelector";
import { Badge } from "@/components/ui/badge"
import { useGetHistoryData } from "@/lib/react-query/history_queries";
import SkeltonWrapper from "./SkeltonWrapper";
import Barchart from "./charts/BarChart";
import { Currencies } from "@prisma/client";
import Linechart from "./charts/LineChart";



const History = ({ projectId, currency }: { projectId: string, currency: Currencies }) => {

    const [timeFrame, setTimeFrame] = useState<"month" | "year">("month")
    const [period, setPeriod] = useState({
        month: new Date().getMonth() ,
        year: new Date().getFullYear()
    })


    const { data: historyData, isLoading: historyLoad } = useGetHistoryData(projectId, timeFrame, period)
     
     
    return (
        <div className="container pb-5">
            <Header title='History' />

            <div className=" bg-card p-4 shadow-lg  mt-2 flex flex-col gap-5 rounded-lg border">

                <div className="flex justify-between flex-wrap-reverse gap-3 items-center">
                    <PeriodSelector period={period} setPeriod={setPeriod} timeFrame={timeFrame} setTimeFrame={setTimeFrame} projectId={projectId} />
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex gap-2 p-2">
                            <div className="h-4 w-4 rounded-full bg-emerald-500" />
                            <p>Income</p>
                        </Badge>

                        <Badge variant="outline" className="flex gap-2 p-2">
                            <div className="h-4 w-4 rounded-full bg-red-500" />
                            <p>Expsense</p>
                        </Badge>

                    </div>
                </div>


                <SkeltonWrapper isLoading={historyLoad} className="h-[300px]">
                    {historyData?.length == 0 ? (

                        <div className="h-[300px] flex flex-col justify-center items-center bg-background rounded-lg border">
                            <h2>No data for the selected period</h2>
                            <p className="text-sm text-muted-foreground text-center">Try selecting a different period or adding new transactions</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Barchart currency={currency} historyData={historyData} timeFrame={timeFrame} />

                            <Linechart currency={currency} historyData={historyData} timeFrame={timeFrame} />
                        </div>
                    )

                    }

                </SkeltonWrapper>
            </div>


        </div>
    );
}

export default History;



'use client'

import { ChartsProps } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import CountUp from 'react-countup';
import { Currencies } from '@/constants';
import { Currencies as CurrencyType } from '@prisma/client';



const Linechart = ({ historyData, timeFrame, currency }: ChartsProps) => {

    return (
        <ResponsiveContainer width={"100%"} height={300}>
            <LineChart
                height={300}
                data={historyData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid
                    strokeDasharray="5 3"
                    strokeOpacity={"0.2"}
                    vertical={false}
                />
                <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                        let { year, month, day } = data;

                        if (timeFrame === "year") month=month-1

                        const date = new Date(year, month, day || 1);
                         
                        if (timeFrame === "year") {
                            return date.toLocaleDateString("default", {
                                month: "long",
                            });
                        }
                        return date.toLocaleDateString("default", {
                            day: "2-digit",
                        });
                    }}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <Line type="monotone" dataKey="income" label="Income" stroke="#10b981" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="expense" label="Expense" stroke="#ef4444" />

                <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => (
                        <CustomTooltip currency={currency} {...props} />
                    )}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default Linechart;

function CustomTooltip({ active, payload, currency }: any) {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const { expense, income } = data;

    return (
        <div className="min-w-[300px] rounded border bg-background p-4">
            <TooltipRow
                label="Expense"
                value={expense}
                bgColor="bg-red-500"
                textColor="text-red-500"
                currency={currency}
            />
            <TooltipRow
                label="Income"
                value={income}
                bgColor="bg-emerald-500"
                textColor="text-emerald-500"
                currency={currency}
            />
            <TooltipRow
                label="Balance"
                value={income - expense}
                bgColor="bg-gray-100"
                textColor="text-foreground"
                currency={currency}
            />
        </div>
    );
}

function TooltipRow({
    label,
    value,
    bgColor,
    textColor,
    currency
}: {
    label: string;
    textColor: string;
    bgColor: string;
    value: number;
    currency: CurrencyType
}) {


    return (
        <div className="flex items-center gap-2">
            <div className={cn("h-4 w-4 rounded-full", bgColor)} />
            <div className="flex w-full justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className={cn("text-sm font-bold flex gap-1", textColor)}>
                    <CountUp
                        duration={0.5}
                        preserveValue
                        end={value}
                        decimals={0}
                        className="text-sm"
                    />
                    {Currencies.find((item) => item?.value === currency)?.label}
                </div>
            </div>
        </div>
    );
}

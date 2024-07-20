'use client'


import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";
import CountUp from 'react-countup';
import { Currencies } from '@/constants';
import { Currencies as CurrencyType } from '@prisma/client';
import { ChartsProps } from '@/types';



const Barchart = ({ historyData, timeFrame, currency }: ChartsProps) => {
    return (
        <ResponsiveContainer width={"100%"} height={300}>
            <BarChart
                height={300}
                data={historyData}
                barCategoryGap={5}

            >
                <defs>
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset={"0"}
                            stopColor="#10b981"
                            stopOpacity={"1"}
                        />
                        <stop
                            offset={"1"}
                            stopColor="#10b981"
                            stopOpacity={"0"}
                        />
                    </linearGradient>


                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset={"0"}
                            stopColor="#ef4444"
                            stopOpacity={"1"}
                        />
                        <stop
                            offset={"1"}
                            stopColor="#ef4444"
                            stopOpacity={"0"}
                        />
                    </linearGradient>
                </defs>

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
                        const { year, month, day } = data;
                        const date = new Date(year, month, day || 1);
                          // Subtract 1 from month
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
                <Bar
                    dataKey={"income"}
                    label="Income"
                    fill="url(#incomeBar)"
                    radius={4}
                    className="cursor-pointer"
                />
                <Bar
                    dataKey={"expense"}
                    label="Expense"
                    fill="url(#expenseBar)"
                    radius={4}
                    className="cursor-pointer"
                />
                <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => (
                        <CustomTooltip currency={currency} {...props} />
                    )}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default Barchart;


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

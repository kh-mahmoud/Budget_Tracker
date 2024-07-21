import { CategoriesCardProps } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Currencies } from "@/constants";
import { Progress } from "../ui/progress";




const CategoriesCard = ({ type, data, currency }: CategoriesCardProps) => {

    const filtredData = data?.filter((item) => item.type === type)
    const total = filtredData?.reduce((acc, curr) => acc + (curr._sum.amount || 0), 0)

    return (
        <div className="bg-card shadow-lg  p-4 h-80 overflow-hidden rounded-lg border">
            <h2 className="text-xl font-bold p-2">
                {type === "income" ? "Incomes by category" : "Expenses by category"}
            </h2>

            <div className="w-full">
                {filtredData?.length === 0 && (
                    <div className="flex flex-col h-60 w-full justify-center items-center">
                        <h2>No data for the selected period</h2>
                        <p className="text-sm text-center text-muted-foreground">Try selecting a different period or try adding new {type === "income" ? "income" : "expense"}</p>
                    </div>
                )}
            </div>

            <div>
                <ScrollArea className="h-60 w-full ">
                    <div className="flex flex-col gap-4 p-4">
                        {filtredData?.map((item) => {
                            const amount = item?._sum.amount || 0
                            const percentage = (amount * 100) / (total || amount)

                            return (
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <div className=" flex gap-1">
                                            {item.categoryIcon} {item.category}
                                            <span>({percentage.toFixed(0)}%)</span>
                                        </div>

                                        <div>
                                            {Currencies.find((item) => item.value === currency)?.label} {amount}
                                        </div>
                                    </div>
                                    <Progress value={percentage} indicator={type === "income" ? "bg-emerald-500" : "bg-red-500"} />



                                </div>
                            )
                        })}
                    </div>


                </ScrollArea>
            </div>

        </div >
    );
}

export default CategoriesCard;

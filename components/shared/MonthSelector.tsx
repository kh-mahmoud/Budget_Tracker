import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { months } from "@/constants";
import { MonthSelectorProps } from "@/types";



const MonthSelector = ({ setPeriod, period,isLoading }: MonthSelectorProps) => {

    return (
        <div>
            <Select
                value={period.month.toString()}
                onValueChange={(value) => setPeriod({
                    month: parseInt(value),
                    year: period.year
                }
                )}
                disabled={isLoading}
            >

                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a year" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {months?.map((month: any) => (
                            <SelectItem value={month.value.toString()} key={month.label}>
                                {month.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

        </div>
    );
}

export default MonthSelector;

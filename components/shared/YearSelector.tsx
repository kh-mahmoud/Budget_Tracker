import { YearSelectorProps } from '@/types';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const YearSelector = ({ setPeriod, period, years, isLoading }: YearSelectorProps) => {
    return (
        <div className='w-full'>
            <Select
                value={period.year.toString()}
                defaultValue={period.year.toString()}
                onValueChange={(value) => setPeriod({
                    month: period.month,
                    year: parseInt(value)
                }
                )}
                disabled={isLoading}

            >

                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a year" />
                </SelectTrigger>

                <SelectContent>
                    <SelectGroup>
                        {years?.length === 0 ?

                            (<SelectItem value={period.year.toString()}>
                                {period.year}
                            </SelectItem>)
                            :
                            (
                                years?.map((year) => (
                                    <SelectItem value={year.toString()} key={year}>
                                        {year}
                                    </SelectItem>
                                ))
                            )
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

        </div>
    );
}

export default YearSelector;

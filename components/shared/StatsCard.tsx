import { Currencies } from "@/constants";
import { StatsCardProps } from "@/types";
import CountUp from 'react-countup';






const StatsCard = ({ value, title, icon, currency }: StatsCardProps) => {
    return (
        <div className=" flex shadow-lg  items-center h-24 gap-2 flex-1 rounded-md p-4 bg-card border">
            {icon}
            <div className="flex flex-col">
                <p className="text-muted-foreground">{title}</p>
                <div className="flex gap-2 text-2xl">
                    <p>{Currencies.find((c) => c.value === currency)?.label}</p>
                    <CountUp
                        preserveValue
                        end={value}
                        redraw={false}
                        decimal="2"
                    />
                </div>

            </div>

        </div>
    );
}

export default StatsCard;

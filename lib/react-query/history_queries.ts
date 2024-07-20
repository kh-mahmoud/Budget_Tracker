import { useQuery } from "react-query";
import { GetHistoryData, GetYearPeriods } from "../actions/history.action";
import { Period, TimeFrame } from "@/types";






// get year periods

export const useGetYearPeriods = (projectId: string) => {
    return useQuery(['year_period', projectId], () => GetYearPeriods(projectId));
};



//get year/month History
export const useGetHistoryData = (projectId: string, timeFrame: TimeFrame, period: Period) => {
    return useQuery(['year_period', projectId, timeFrame, period], () => GetHistoryData(projectId, timeFrame, period));
};






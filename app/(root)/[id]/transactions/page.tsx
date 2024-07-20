'use client'

import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from 'react';
import { toast } from 'sonner';
import { MAX_DATE_RANGE_DAYS, toUTC } from '@/lib/utils';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Header from "@/components/shared/Header";
import TransactionsTable from "@/components/shared/TransactionsTable";
import { useParams } from "next/navigation";





const page = () => {

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const { id } = useParams();
  const projectId = Array.isArray(id) ? id[0] : id;




return (
    <div className='flex flex-col gap-3 pb-6'>

      {/*Transactions header*/}
      <div className="bg-card border-b py-6">
        <div className="container  ">
          <div className='flex flex-wrap gap-3 max-md:justify-center justify-between items-center'>
            <Header title='Transactions history' />
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
        </div>
      </div>

      <div className="container">
          <TransactionsTable from={dateRange.from} to={dateRange.to} projectId={projectId}/>
      </div>



    </div>
  )
}

export default page;

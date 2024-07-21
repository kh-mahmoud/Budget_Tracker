"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReactNode, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { transactionSchema } from "@/lib/validation/transaction";
import CategoryPicker from "../CategoryPicker";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useCreateTransaction } from "@/lib/react-query/transactions_queries";
import { SelectSingleEventHandler } from "react-day-picker";

export function TransactionForm({ children, action }: { children: ReactNode, action: 'income' | 'expense' }) {
  //states
  const closeModal = useRef<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { mutate } = useCreateTransaction();
  const projectId = Array.isArray(id) ? id[0] : id;

  //form initial values
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      amount: 0,
      category: "",
    },
  });

  //transaform the date to locale time zone

  const handleDateSelect: SelectSingleEventHandler = (date) => {
    if (date instanceof Date) {
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      form.setValue("date", localDate);
    }
  };

  //submit the forme
  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    try {
      setLoading(true);

      const utcDate = new Date(Date.UTC(values.date.getFullYear(), values.date.getMonth(), values.date.getDate()));

      const transaction = {
        amount: values.amount,
        description: values.description,
        date: utcDate,
        category: values.category,
        type: action,
        projectId,
      };


      mutate(transaction, {
        onSuccess: () => {
          setLoading(false);
          form.reset();
          toast.success("Transaction created successfully", { duration: 3000 });
          closeModal.current?.click();
        },
        onError: (error) => {
          console.log(error);
          setLoading(false);
          toast.error("Something went wrong, try later", { duration: 3000 });
        },
      });

    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("something went wrong try later", { duration: 3000 });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-md">
        <DialogHeader>
          <DialogTitle className="flex justify-start">
            create new&nbsp;<span className={`${action == "income" ? "text-emerald-500" : "text-red-500"}`}>{action}</span>&nbsp; transaction
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="custom_input" placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      className="custom_input"
                      type="number" placeholder="amount" {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-between items-center flex-wrap ">

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <CategoryPicker onChange={field.onChange} type={action} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex gap-y-1 flex-col">
                      <FormLabel className="mt-1">Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className="justify-between flex items-center"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <p className="font-bold text-sm">Pick a date...</p>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={handleDateSelect}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </div>

            <div className="flex gap-3 justify-end">
              <Button disabled={loading} type="submit">{loading ? "Saving..." : "Save"}</Button>
              <Button onClick={() => closeModal.current?.click()} type="button" variant={'outline'}>Close</Button>
            </div>
          </form>
        </Form>
        <DialogClose asChild>
          <Button ref={closeModal} className="hidden" type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

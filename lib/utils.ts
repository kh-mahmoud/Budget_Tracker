import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const MAX_DATE_RANGE_DAYS = 90

//convert dates to utc
export const toUTC = (date: Date | null): Date => {
  return date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) : new Date();
};


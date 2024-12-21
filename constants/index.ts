import { Currencies as CurrencyType } from "@prisma/client";


export const GenerateNavLinks = (id?: string | string[]) => {
  if (id != undefined) {
    return [

      { label: "Dashboard", path: `/${id}` },
      { label: "Transactions", path: `/${id}/transactions` },
      { label: "Manage", path: `/${id}/manage` },
    ]
  }

  return [

    { label: "Dashboard", path: "/" },

  ]

}




export const Currencies = [
  { value: CurrencyType.USD, label: "$", locale: "en-US" },
  { value: CurrencyType.EUR, label: "€", locale: "de-DE" },
  { value: CurrencyType.JPY, label: "¥", locale: "ja-JP" },
  { value: CurrencyType.GBP, label: "£", locale: "en-GB" },
  { value: CurrencyType.DZ, label: "د.ج", locale: "ar-DZ" },
];


export const defaultValues = {
  title: "",
  description: ""
}


export const months = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" }
];

export const Year_months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];


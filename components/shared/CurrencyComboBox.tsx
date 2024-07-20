"use client"

import { useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Currencies } from "@/constants"
import { Currencies as CurrencyType } from "@prisma/client"
import SkeltonWrapper from "./SkeltonWrapper"
import { updateUserCurrency } from "@/lib/actions/user.actions"

export type Currency = {
  value: CurrencyType
  label: string
  locale: string
}

import { toast } from 'sonner';
import { CheckIcon } from "lucide-react"



export function CurrencyComboBox({ currency,permission }: { currency: CurrencyType,permission:boolean }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedOption, setSelectedOption] = useState<Currency | null>(null)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    if (currency) setIsLoading(false)

    const userCurrency = Currencies.find((item) => item.value === currency)
    if (userCurrency) {
      setSelectedOption(userCurrency)
    }
  }, [currency])


  const handleSelectOption = async (value: CurrencyType) => {
    setIsLoading(true)
    toast.loading("Updating currency", { id: "update-currency", duration: 3000 })

    const selected = Currencies.find((currency) => currency.value === value) || null
    setSelectedOption(selected)
    const updatedCurrency = await updateUserCurrency(selected?.value)

    if (updatedCurrency) {
      setIsLoading(false)
      toast.success("currency updated succefuly", { id: "update-currency", duration: 3000 })
    }
    else {
      setIsLoading(false)
      toast.error("error,something went wrong", { duration: 3000 })
    }

    setOpen(false)
  }

  if (isDesktop) {
    return (
      <SkeltonWrapper isLoading={isLoading}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button disabled={isLoading || !permission} variant="outline" className="w-full justify-start">
              {selectedOption ? <>{selectedOption.label + " " + selectedOption.value}</> : <>Pick up your currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <StatusList selectedOption={selectedOption} setOpen={setOpen} setSelectedOption={handleSelectOption} />
          </PopoverContent>
        </Popover>
      </SkeltonWrapper>
    )
  }

  return (
    <SkeltonWrapper isLoading={isLoading}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button disabled={isLoading} variant="outline" className="w-full justify-start">
            {selectedOption ? <>{selectedOption.label}</> : <>Pick up your currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <StatusList selectedOption={selectedOption} setOpen={setOpen} setSelectedOption={handleSelectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeltonWrapper>
  )
}

function StatusList({
  setOpen,
  setSelectedOption,
  selectedOption
}: {
  setOpen: (open: boolean) => void
  setSelectedOption: (status: CurrencyType) => void
  selectedOption: { value: any, label: string, locale: string } | null,
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currencies..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(currency.value)
                setOpen(false)
              }}
            >
              {currency.label + " " + currency.value}
              <CheckIcon
                className={`ml-auto h-4 w-4 ${selectedOption?.value === currency.value ? "opacity-100" : "opacity-0"}`}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

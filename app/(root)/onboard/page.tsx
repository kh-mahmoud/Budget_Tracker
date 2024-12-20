import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator'
import { getUserById } from '@/lib/actions/user.actions';
import { Button } from "@/components/ui/button"
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import { CurrencyComboBox } from '@/components/shared/CurrencyComboBox';
import { GetProjectById } from '@/lib/actions/project.actions';



const page = async ({ params: { id } }: { params: { id: string } }) => {


     const { userId } = auth()
     if (!userId) redirect("/sign-in")

     const user = await getUserById()
     if (!user) redirect("/sign-in")




     return (

          <div className='max-w-2xl container p-3 flex-col gap-4 mx-auto flex justify-between items-center'>
               <h1 className="text-center text-3xl">
                    Welcome, <span className="ml-2 font-bold">{user.firstName}! 👋</span>
               </h1>

               <h2 className="mt-4 text-center text-base text-muted-foreground">
                    Let &apos;s get started by setting up your currency
               </h2>

               <h3 className="mt-2  text-center text-sm text-muted-foreground">
                    You can change these settings at any time
               </h3>
               <Separator />

               <Card className="w-full">
                    <CardHeader>
                         <CardTitle> Currency</CardTitle>
                         <CardDescription>
                              Set your default currency for transactions
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <CurrencyComboBox permission={true} currency={user.currency} />
                    </CardContent>

               </Card>

               <Separator />

               <Button className="w-full" asChild>
                    <Link href={"/"}>I&apos;m done! Take me to the dashboard</Link>
               </Button>


          </div >
     );
}

export default page;

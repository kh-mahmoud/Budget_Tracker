import CategoriesManager from '@/components/shared/CategoriesManager';
import { CurrencyComboBox } from '@/components/shared/CurrencyComboBox';
import Header from '@/components/shared/Header';
import { GetProjectById } from '@/lib/actions/project.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';






const page = async ({ params: { id } }: { params: { id: string } }) => {

    const { orgId } = auth()

    const user = await getUserById()
    if (!user) redirect("/sign-in")

    const project = await GetProjectById(id)
    if (!project) redirect("/")

    const currency = orgId ? project.creator.currency : user.currency
    const permission = user.role === "org:admin" || project.creator.id === user.id



    return (
        <div className='flex flex-col gap-5 pb-10'>
            <div className='container border-b py-6 bg-card'>
                <Header title='Manage' subTitle='Manage your account settings and categories' />
            </div>

            <div className='mx-[1rem] shadow-lg p-6 border rounded-md flex flex-col gap-5 bg-card '>
                <Header TitleClassName='text-xl' subTitleClassName='text-sm' title='Currency' subTitle='Set your default currency for transactions' />

                <CurrencyComboBox permission={permission} currency={currency} />
            </div>

            <div className='flex flex-col gap-3'>
                <div className='mx-[1rem] bg-card rounded-md border '>
                    <CategoriesManager
                        title={"Incomes Categories"}
                        subtitle={"Sorted by name"}
                        icon={<TrendingUp className='h-12 w-12 bg-emerald-400/10 text-emerald-500 p-1 rounded-md' />}
                        type={"income"}
                        projectId={id}
                        permission={permission}
                    />

                </div>
                <div className='mx-[1rem] bg-card rounded-md border  '>
                    <CategoriesManager
                        title={"Expenses Categories"}
                        subtitle={"Sorted by name"}
                        icon={<TrendingDown className='h-12 w-12 bg-rose-400/10 text-rose-500 p-1 rounded-md' />}
                        type={"expense"}
                        projectId={id}
                        permission={permission}


                    />

                </div>
            </div>



        </div>
    );
}

export default page;

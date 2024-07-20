'use client'

import { CategoriesManagerProps } from '@/types';
import React from 'react';
import Header from './Header';
import { CategoryForm } from './forms/CategoryForm';
import { Button } from '../ui/button';
import { PlusSquare, Trash } from 'lucide-react';
import { useDeleteCategory, useGetProjectCategories } from '@/lib/react-query/categories_queries';
import { toast } from 'sonner';
import SkeltonWrapper from './SkeltonWrapper';





const CategoriesManager = ({ permission, title, subtitle, icon, type, projectId }: CategoriesManagerProps) => {

    const { data: categories, isLoading } = useGetProjectCategories(projectId, type)



    return (
        <>
            <SkeltonWrapper isLoading={isLoading}>
                <div className='border-b p-6 flex justify-between items-center shadow-lg'>
                    <div className='flex gap-2'>
                        {icon}
                        <Header TitleClassName='text-xl' subTitleClassName='text-sm' title={title} subTitle={subtitle} />
                    </div>

                    <CategoryForm action={type}>
                        <Button className="flex justify-start rounded-md items-center  px-4 gap-x-2">
                            <PlusSquare />
                            Create new
                        </Button>
                    </CategoryForm>
                </div>


                <div className='flex flex-wrap gap-3 p-3 '>

                    {categories && categories?.length <= 0 ? (
                        <div className='w-full h-full p-12 justify-center items-center flex flex-col'>
                            <h2>No <span className={`${type === "income" ? "text-emerald-500" : "text-rose-500"}`}>{type}</span> categories yet</h2>
                            <p className='text-sm text-muted-foreground'>Create one to get started</p>
                        </div>
                    ) :
                        (categories?.map((item) =>
                        (
                            <Card permission={permission} key={item.id} category={item} />
                        )))
                    }

                </div>
            </SkeltonWrapper>

        </>
    );
}

export default CategoriesManager;



const Card = ({ category, permission }: { category: { id: string, name: string, icon: string }, permission: boolean }) => {

    const { mutate, isLoading } = useDeleteCategory()

    const deleteCategory = (id: string) => {
        mutate(id, {
            onSuccess: () => {
                toast.success("category has been deleted succefuly")
            },
        })
    }
    return (
        <div className='w-[300px] border rounded-md flex flex-col'>
            <div className='flex flex-col justify-center gap-3 p-6 items-center'>
                <span className="w-32 scale-[2] flex justify-center items-center">{category.icon}</span>
                <p>{category.name}</p>
            </div>

            <Button disabled={isLoading || !permission} onClick={() => deleteCategory(category.id)} className='bg-gray-300 hover:bg-red-500 transition-colors cursor-pointer p-3 flex rounded-b-md rounded-t-none justify-center items-center gap-2 '>
                <Trash />
                <p>Remove</p>
            </Button>


        </div>
    )

}

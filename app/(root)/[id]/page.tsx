import { TransactionForm } from "@/components/shared/forms/TransactionForm";
import Header from "@/components/shared/Header";
import History from "@/components/shared/History";
import Overview from "@/components/shared/Overview";
import { Button } from "@/components/ui/button";
import { GetProjectById } from "@/lib/actions/project.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



const page = async ({ params: { id } }: { params: { id: string } }) => {

  const { orgId } = auth()

  const user = await getUserById()
  if (!user) redirect("/sign-in")

  const project = await GetProjectById(id)
  if (!project) redirect("/")

  const currency = orgId ? project.creator.currency : user.currency

  const permission = user.role === "org:admin" || project.creator.id === user.id


  return (
    <div className="h-full bg-background flex flex-col gap-7">
      <div className="bg-card border-b">
        <div className="container max-md:flex-col gap-y-3 flex justify-between gap-x-3 py-8 items-center">

          <Header title={`Hello, ${user?.firstName}! 👋`} />

          <div className="flex gap-3 items-center flex-wrap justify-end">
            <TransactionForm action={"income"}>
              <Button disabled={!permission} variant={"outline"} className="custom_income_btn">
                New income 🤑
              </Button>
            </TransactionForm>

            <TransactionForm action={"expense"}>
              <Button  disabled={!permission} variant={"outline"} className="custom_expense_btn">
                New expense 😤
              </Button>
            </TransactionForm>

          </div>
        </div>
      </div>

      <Overview projectId={id} currency={orgId ? project.creator.currency : user.currency} />

      <History projectId={id} currency={currency} />
    </div>
  );
}

export default page;

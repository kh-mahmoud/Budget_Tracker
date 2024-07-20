import Header from "@/components/shared/Header";
import SearchBar from "@/components/shared/SearchBar";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProjectForm } from "@/components/shared/forms/ProjectForm";
import ProjectCard from "@/components/shared/ProjectCard";
import { GetProjects } from "@/lib/actions/project.actions";
import OrgSwitcher from "@/components/shared/OrgSwitcher";
import { FilePlus } from "lucide-react";
import {Project } from "@prisma/client"



const page = async ({ searchParams }: { searchParams: { q: string } }) => {

  const { userId } = auth()
  let { orgId } = auth()
  orgId = orgId || undefined;


  if (!userId) redirect("/sign-in")

  const user = await getUserById()
  if (!user) redirect("/sign-in")

  let projects = await GetProjects(orgId)

  const author = userId == user.clerkId

  projects = projects?.filter((project:Project) => project.title.toLowerCase().includes(searchParams.q?.toLowerCase() || ""))



  return (
    <div className="h-full bg-background flex flex-col gap-4 container mt-8">
      <div className="flex gap-2 items-center">
        <Header title={"My Projects "} />
        <span className="text-2xl">{">"}</span>
        <OrgSwitcher />
      </div>

      <div className="flex items-center justify-between gap-3">
        <SearchBar />

        <ProjectForm userId={userId} orgId={orgId} action="create">
          <div className={`bg-card py-3 shadow-md px-4 rounded-md cursor-pointer`}>
            <FilePlus />
          </div>
        </ProjectForm>
      </div>

      <div className="flex gap-6 items-center mt-5 flex-wrap">

        {projects && projects?.length < 1 ? (
          <div className="w-full h-[300px] flex justify-center items-center">
            <p className="text-muted-foreground">No Project found</p>

          </div>
        ) :
          (projects?.map((project, index) => {
            return (
              <div key={index}>
                <ProjectCard role={user.role} author={author} project={project} />
              </div>
            )
          }))


        }






      </div>


    </div>
  );
}

export default page;

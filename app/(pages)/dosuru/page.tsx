import { getProjects } from "@/app/_features/projects/actions";
import { ProjectColumn } from "@/app/_features/projects/components/ProjectColumn";

export default async function Page() {

  const projects = await getProjects();

  return (
    <>
      <div className="py-8 px-4 w-full h-full">
        <h1 className="text-4xl text-center mb-10">This is ProjectList</h1>
        <div className="flex flex-col gap-3 mx-auto justify-between max-w-md">
          <ProjectColumn projects={projects} />
        </div>
      </div>
    </>
  );
}
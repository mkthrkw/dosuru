import { getProjectDetail } from "@/app/_features/projects/actions";
import { ProjectAvatarForm } from "@/app/_features/projects/forms/AvatarForm";
import { ProjectUpdateForm } from "@/app/_features/projects/forms/UpdateForm";
import { ProjectDeleteForm } from "@/app/_features/projects/forms/DeleteForm";
import { notFound } from "next/navigation";

export default async function Page(
  { params }: { params: Promise<{ projectId: string }> }
) {

  const { projectId } = await params;
  const project = await getProjectDetail(projectId);
  if (!project) {
    notFound();
  }

  return (
    <div className="p-8 w-full h-full" >
      <h1 className="text-4xl text-center mb-16">{project.name}</h1>
      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <ProjectAvatarForm project={project} />
        </div>
        <div className="mb-16">
          <ProjectUpdateForm project={project} />
        </div>
        <div>
          <ProjectDeleteForm project={project}
          />
        </div>
      </div>
    </div >
  );
}
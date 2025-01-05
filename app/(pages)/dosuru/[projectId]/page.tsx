import { getProjectNestedData } from "@/app/_features/projects/actions";
import { ListColumn } from "@/app/_features/lists/components/ListColumn";
import { ProjectHeader } from "@/app/_features/projects/components/ProjectHeader";
import { notFound } from "next/navigation";

export default async function Page(
  { params }: { params: Promise<{ projectId: string }> }
) {

  const { projectId } = await params;
  const projectListTicket = await getProjectNestedData(projectId);
  if (!projectListTicket) {
    notFound();
  }

  return (
    <>
      <ProjectHeader projectId={projectListTicket.id} projectName={projectListTicket.name} />
      <div className="h-full overflow-auto px-0 lg:px-4 pb-2">
        <div className="flex lg:inline-flex lg:gap-3 h-full">
          <ListColumn projectListTicket={projectListTicket} />
        </div>
      </div>
    </>
  );
}
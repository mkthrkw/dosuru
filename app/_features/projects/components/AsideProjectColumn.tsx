import { Project } from "@prisma/client";
import { getProjects } from "../actions";
import { AsideProjectCard } from "./AsideProjectCard";


export async function AsideProjectColumn() {
  const projects: Project[] = (await getProjects()) || [];

  return (
    projects.map((projectDetail) => (
      <AsideProjectCard projectDetail={projectDetail} key={projectDetail.id} />
    ))
  );
}
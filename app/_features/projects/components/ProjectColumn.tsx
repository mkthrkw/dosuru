"use client";

import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { ProjectCard } from "./ProjectCard";
import { useEffect, useState } from "react";
import { getMovedProjects, updateMovedProjects } from "@/app/_lib/dnd_kit/actions";
import { useRouter } from 'next/navigation';
import { Project } from "@prisma/client";

export function ProjectColumn({ projects }: { projects: Project[] }) {

  const [projectsState, setProjectsState] = useState<Project[]>(projects);
  const router = useRouter();

  useEffect(() => {
    if (projectsState === projects) return;
    setProjectsState(projects);
  }, [projects]);

  return (
    <DndContext
      id="projectColumn"
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <SortableContext items={projectsState} id="projectColumn">
        {projectsState.map((project: Project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const movedProjects = getMovedProjects(event, projectsState);
    if (!movedProjects) return;
    setProjectsState(movedProjects);
    updateMovedProjects(movedProjects);
    router.refresh();
  }
}
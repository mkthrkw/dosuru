import { ProjectListTicket } from "@/app/_util/types/nestedType";
import { ClientRect, closestCorners, Collision } from "@dnd-kit/core";
import { Active, DroppableContainer, RectMap } from "@dnd-kit/core/dist/store";
import { Coordinates } from "@dnd-kit/core/dist/types";

type Args = {
  active: Active;
  collisionRect: ClientRect;
  droppableRects: RectMap;
  droppableContainers: DroppableContainer[];
  pointerCoordinates: Coordinates | null;
};

export function customClosestCorners(
  args: Args,
  projectListTicket: ProjectListTicket,
): Collision[] {
  const cornerCollisions = closestCorners(args);
  const idLists = projectListTicket.lists.map((list) => list.id);
  // リストを動かしている場合は、プロジェクトIDのコンテナを取得
  // チケットを動かしている場合は、リストIDのコンテナで一番近いものを取得
  const closestContainer = cornerCollisions.find((c) => {
    if (idLists.includes(String(args.active.id))) {
      return c.id === projectListTicket.id;
    } else {
      return idLists.includes(String(c.id));
    }
  });
  // コンテナが見つからない場合は、cornerCollisionsを返す
  if (!closestContainer) return cornerCollisions;

  // closestContainerに一致するコンテナのみを取得
  const collisions = cornerCollisions.filter(({ data }) => {
    if (!data) return false;
    const droppableData = data.droppableContainer?.data?.current;
    if (!droppableData) return false;
    const { containerId } = droppableData.sortable;
    return closestContainer.id === containerId;
  });
  // collisionsがない場合は、closestContainerを返す
  if (collisions.length === 0) {
    return [closestContainer];
  }
  // collisionsがある場合は、collisionsを返す
  return collisions;
}

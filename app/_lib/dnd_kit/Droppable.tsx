import {useDroppable} from '@dnd-kit/core';

type DroppableProps = {
  children: React.ReactNode;
  id: string;
  isOverAddClass?: string;
};

export function Droppable({children, id}: DroppableProps) {
  const {setNodeRef} = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
}
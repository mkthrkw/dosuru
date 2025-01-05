import { updateProjectsOrder } from "@/app/_features/projects/actions";
import { Active, Over } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import { ListTicket, ProjectListTicket } from "@/app/_util/types/nestedType";
import { List, Project } from "@prisma/client";
import { updateListOrder, updateListTicketOrder } from "@/app/_features/lists/actions";
import { arrayInsert, arrayRemove } from "@/app/_util/helper/array";

/**
 * 同じコンテナ内でチケットが移動した場合の処理を行います。
 *
 * @param event - ドラッグ＆ドロップイベントの情報。
 * @param projectListTicket - プロジェクト、リスト、チケットの情報を持つオブジェクト。
 * @returns 移動後のリスト。
 */
export function getMovedTicketsSameContainer(
  event: { active: Active; over: Over | null },
  projectListTicket: ProjectListTicket,
) {
  const moveData = getMoveData(event);
  if (!moveData) return;
  const { from, to } = moveData;
  if (from.containerId !== to.containerId) return;
  if (!from || !to) return;

  return projectListTicket.lists.find((list) => {
    if (list.id === from.containerId) {
      list.tickets = arrayMove(list.tickets, from.index, to.index);
      list.tickets = list.tickets.map((ticket, index) => {
        ticket.order = index;
        return ticket;
      });
      return list;
    }
  });
}

/**
 * 異なるコンテナ間でチケットが移動した場合の処理を行います。
 *
 * @param event - ドラッグ＆ドロップイベントの情報。
 * @param projectListTicket - プロジェクト、リスト、チケットの情報を持つオブジェクト。
 * @returns 移動後のリスト（fromListとtoList）。
 */
export function getMovedTicketsOtherContainer(
  event: { active: Active; over: Over | null },
  projectListTicket: ProjectListTicket,
) {
  const moveData = getMoveData(event);
  if (!moveData) return;
  const { from, to } = moveData;
  if (!from || !to) return;
  if (from.containerId === to.containerId) return;
  if (to.containerId === projectListTicket.id) {
    to.containerId = event.over?.id;
    to.index = NaN;
    to.items = NaN;
  }

  const fromList = projectListTicket.lists.find((list) => list.id === from.containerId);
  if (!fromList) return;
  const toList = projectListTicket.lists.find((list) => list.id === to.containerId);
  if (!toList) return;
  const moveTicket = fromList.tickets[from.index];

  fromList.tickets = arrayRemove(fromList.tickets, from.index);
  fromList.tickets = fromList.tickets.map((ticket, index) => {
    ticket.order = index;
    return ticket;
  });
  toList.tickets = arrayInsert(toList.tickets, to.index, moveTicket);
  toList.tickets = toList.tickets.map((ticket, index) => {
    ticket.order = index;
    return ticket;
  });

  return { fromList, toList };
}

/**
 * リストが移動した場合の処理を行います。
 *
 * @param event - ドラッグ＆ドロップイベントの情報。
 * @param lists - リストの配列。
 * @returns 移動後のリストの配列。
 */
export function getMovedLists(event: { active: Active; over: Over | null }, lists: ListTicket[]) {
  const moveData = getMoveData(event);
  if (!moveData) return;
  const { from, to } = moveData;
  if (!from || !to) return;
  const movedLists = arrayMove(lists, from.index, to.index);
  return movedLists.map((list, index) => {
    list.order = index;
    return list;
  });
}

/**
 * プロジェクトが移動した場合の処理を行います。
 *
 * @param event - ドラッグ＆ドロップイベントの情報。
 * @param projects - プロジェクトの配列。
 * @returns 移動後のプロジェクトの配列。
 */
export function getMovedProjects(
  event: { active: Active; over: Over | null },
  projects: Project[],
) {
  const moveData = getMoveData(event);
  if (!moveData) return;
  const { from, to } = moveData;
  if (!from || !to) return;
  const movedProjects = arrayMove(projects, from.index, to.index);
  return movedProjects.map((project, index) => {
    project.order = index;
    return project;
  });
}

// ================================================================
//
//                          Common Actions
//
// ================================================================

/**
 * ドラッグ＆ドロップイベントから移動元と移動先のデータを取得します。
 *
 * @param event - ドラッグ＆ドロップイベントの情報。
 * @returns 移動元と移動先のデータ。
 */
export function getMoveData(event: { active: Active; over: Over | null }) {
  const { active, over } = event;
  // キャンセルされた、もしくはターゲットがない場合はリターン
  if (!active || !over) return;
  // ドラッグアイテムとターゲットが同じ場合はリターン
  if (active.id === over.id) return;
  // activeのデータを取得
  const fromData = active.data.current?.sortable;
  if (!fromData) return;
  // overのデータを取得
  const toData = over.data.current?.sortable;
  // データを返す
  return {
    from: fromData,
    to: toData,
  };
}

// ================================================================
//
//                          Update Actions
//
// ================================================================

/**
 * 移動したチケットの順序を更新します。
 *
 * @param movedLists - 移動後のリストの配列。
 */
export async function updateMovedTickets(movedLists: ListTicket[]) {
  const result = await updateListTicketOrder(movedLists);
  if (result.state === "rejected") {
    toast.error(result.message);
  }
}

/**
 * 移動したリストの順序を更新します。
 *
 * @param movedLists - 移動後のリストの配列。
 */
export async function updateMovedLists(movedLists: List[]) {
  const result = await updateListOrder(movedLists);
  if (result.state === "rejected") {
    toast.error(result.message);
  }
}

/**
 * 移動したプロジェクトの順序を更新します。
 *
 * @param movedProjects - 移動後のプロジェクトの配列。
 */
export async function updateMovedProjects(movedProjects: Project[]) {
  const result = await updateProjectsOrder(movedProjects);
  if (result.state === "rejected") {
    toast.error(result.message);
  }
}

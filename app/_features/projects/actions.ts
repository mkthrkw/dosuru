"use server";

import { ProjectSchemaType } from "@/app/_features/projects/schema";
import { uploadImage } from "@/app/_lib/cloudinary/actions";
import { ActionState } from "@/app/_util/types/actionType";
import { prisma } from "@/prisma/prisma";
import { getSessionUserId } from "@/app/_features/user/actions";
import { Project } from "@prisma/client";
import { ProjectListTicket } from "@/app/_util/types/nestedType";
import { revalidatePath } from "next/cache";

/* ==================================================================
 *
 * Create
 *
================================================================== */

/**
 * 新しいプロジェクトを作成します。
 *
 * @param inputValues プロジェクトの作成に必要なデータを含むオブジェクト。
 *                    name: プロジェクト名
 *                    description: プロジェクトの説明
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function createProject(inputValues: ProjectSchemaType): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    const userId = await getSessionUserId();

    await prisma.$transaction(async (tx) => {
      // 既存レコードの表示順序最大値を取得
      const maxOrder = await tx.project.aggregate({
        _max: { order: true },
        where: { userId: userId },
      });

      // レコードが存在しない場合は0を設定
      const order = maxOrder._max?.order || 0;

      // 新規レコードを作成
      await tx.project.create({
        data: {
          name: inputValues.name,
          description: inputValues.description,
          order: order + 1,
          userId: userId,
        },
      });
    });
    revalidatePath("/dosuru");
    prevState.state = "resolved";
    prevState.message = "Project created successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to create project: ${error}`;
    return prevState;
  }
}

/* ==================================================================
 *
 * Read
 *
================================================================== */

/**
 * 現在のユーザーが作成したプロジェクトを全て取得します。
 *
 * @returns プロジェクトの配列をPromiseで返します。
 *          取得に失敗した場合はnullを返します。
 */
export async function getProjects(): Promise<Project[] | null> {
  try {
    const userId = await getSessionUserId();
    return await prisma.project.findMany({
      where: { userId: userId },
      orderBy: { order: "desc" },
    });
  } catch (error) {
    console.error(`Failed to fetch projects: ${error}`);
    return null;
  }
}

/**
 * 指定されたIDを持つプロジェクトの詳細を取得します。
 *
 * @param targetId 取得するプロジェクトのID。
 * @returns プロジェクトが見つかった場合はプロジェクトオブジェクト、見つからなかった場合はnullをPromiseで返します。
 */
export async function getProjectDetail(targetId: string): Promise<Project | null> {
  try {
    return await prisma.project.findUnique({
      where: { id: targetId },
    });
  } catch (error) {
    console.error(`Failed to fetch project: ${error}`);
    return null;
  }
}

/**
 * 指定されたIDを持つプロジェクトの詳細と、関連するリストとチケットをネストした形式で取得します。
 *
 * @param targetId 取得するプロジェクトのID。
 * @returns プロジェクト、リスト、チケットがネストされたオブジェクトをPromiseで返します。
 *          プロジェクトが見つからなかった場合はnullを返します。
 */
export async function getProjectNestedData(targetId: string): Promise<ProjectListTicket | null> {
  try {
    return await prisma.project.findUnique({
      where: { id: targetId },
      include: {
        lists: {
          include: {
            tickets: { orderBy: { order: "desc" } },
          },
          orderBy: { order: "desc" },
        },
      },
    });
  } catch (error) {
    console.error(`Failed to fetch project: ${error}`);
    return null;
  }
}

/* ==================================================================
 *
 * Project update
 *
================================================================== */

/**
 * プロジェクトを更新します。
 *
 * @param inputValues 更新するプロジェクトデータを含むオブジェクト。
 * @param targetId 更新するプロジェクトのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateProject(
  inputValues: ProjectSchemaType,
  targetId: string,
): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    await prisma.project.update({
      where: {
        id: targetId,
      },
      data: {
        name: inputValues.name,
        description: inputValues.description,
      },
    });
    revalidatePath("/dosuru");
    prevState.state = "resolved";
    prevState.message = "Project updated successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to update project: ${error}`;
    return prevState;
  }
}

/**
 * プロジェクトのアバター画像を更新します。
 *
 * @param fileString アップロードする画像のファイル文字列。
 * @param targetId 更新するプロジェクトのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateProjectAvatar(
  fileString: string,
  targetId: string,
): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    const userId = await getSessionUserId();
    const results = await uploadImage(fileString, userId, targetId);
    await prisma.project.update({
      where: {
        id: targetId,
      },
      data: {
        image: results.secure_url,
      },
    });
    revalidatePath("/dosuru");
    prevState.state = "resolved";
    prevState.message = "Project avatar updated successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to update project avatar: ${error}`;
    return prevState;
  }
}

/* ==================================================================
 *
 * Order update
 *
================================================================== */

/**
 * プロジェクトの表示順序を更新します。
 *
 * @param projects 更新するプロジェクトの配列。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function updateProjectsOrder(projects: Project[]): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    await prisma.$transaction(
      projects.reverse().map((project, index) =>
        prisma.project.update({
          where: { id: project.id },
          data: { order: index + 1 },
        }),
      ),
    );
    prevState.state = "resolved";
    prevState.message = "Projects order updated successfully";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to update projects order: ${error}`;
    return prevState;
  }
}

/* ==================================================================
 *
 * Delete
 *
================================================================== */

/**
 * プロジェクトを削除します。
 *
 * @param targetId 削除するプロジェクトのID。
 * @returns 更新後の状態を含むActionStateオブジェクトをPromiseで返します。
 *          成功した場合は state が "resolved" に、失敗した場合は state が "rejected" に設定されます。
 */
export async function deleteProject(targetId: string): Promise<ActionState> {
  const prevState: ActionState = { state: "pending", message: "" };
  try {
    await prisma.project.delete({
      where: { id: targetId },
    });
    revalidatePath("/dosuru");
    prevState.state = "resolved";
    prevState.message = "Project deleted successfully.";
    return prevState;
  } catch (error) {
    prevState.state = "rejected";
    prevState.message = `Failed to delete project: ${error}`;
    return prevState;
  }
}

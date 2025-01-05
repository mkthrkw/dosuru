import { LogOut } from "@/app/_features/auth/components/LogOut";
import { getUserInstance } from "@/app/_features/user/actions";
import { UserAvatarForm } from "@/app/_features/user/forms/AvatarForm";
import { UserUpdateForm } from "@/app/_features/user/forms/UpdateForm";
import { getDateTimeFullStyle } from "@/app/_lib/tempo/format";

export default async function Page() {

  const user = await getUserInstance();
  if (!user) {
    throw new Error("User not found");
  }

  return (
    <div className="p-8 w-full h-full">
      <h1 className="text-4xl text-center mb-16">アカウント情報</h1>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <UserAvatarForm user={user} />
        </div>
        <div className="mb-8 p-4 rounded-2xl border-2 text-base-content/70">
          <table className="table table-xs">
            <tbody>
              <tr>
                <td>ID</td>
                <td>{user.id}</td>
              </tr>
              <tr>
                <td>作成日時</td>
                <td>{getDateTimeFullStyle(user.createdAt)}</td>
              </tr>
              <tr>
                <td>更新日時</td>
                <td>{getDateTimeFullStyle(user.updatedAt)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <UserUpdateForm user={user} />
        <LogOut />
      </div>
    </div >
  );
}
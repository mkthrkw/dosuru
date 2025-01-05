import { logout } from "../actions";

export function LogOut() {

  return (
    <>
      <button
        className="btn mt-16 w-full bg-base-200 hover:bg-base-content hover:text-base-100"
        onClick={logout}
      >
        ログアウト
      </button>
    </>
  );
}
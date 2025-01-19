import { FirstInputForm } from "@/app/_features/ai/forms/first-input-form";
import { SecondInputForm } from "@/app/_features/ai/forms/second-input-form";

// セッションからユーザーを特定する必要があるため
export const dynamic = "force-dynamic";

export default function Page() {

  return (
    <>
      <div className="py-8 h-full justify-center max-w-md mx-auto flex flex-col gap-8">
        <h1 className="text-4xl text-center">Are you dosuru?</h1>
        <div className="text-left mx-auto">
          <p>1. やりたいことを入力してください。</p>
          <p>2. いくつかのタスクに分解します。</p>
          <p>3. そのタスクからプロジェクトを作成します。</p>
        </div>
        <FirstInputForm />
        <SecondInputForm />
      </div>
    </>
  );
}
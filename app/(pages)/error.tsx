'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-center p-4 bg-gray-950">
      <h2 className="text-5xl text-center font-bold text-error mb-4">
        エラーが発生しました
      </h2>
      <div className="text-center text-gray-400 my-8">
        ご迷惑をおかけして申し訳ございません。
        <br />
        問題が発生しました。
      </div>
      <div className="text-center text-gray-400 mb-4">
        エラー内容: {error.message}
      </div>
      <button
        className="mt-4 rounded-md bg-gray-700 px-8 py-4 text-xl text-gray-300 transition-colors hover:bg-gray-600"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        再試行する
      </button>
    </main>
  );
}
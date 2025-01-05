import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center p-4 bg-gray-950">
      <FaceFrownIcon className="w-24 h-24 text-gray-500 mb-4" />
      <h2 className="text-3xl font-bold text-white mb-2">
        ページが見つかりません
      </h2>
      <p className="text-gray-400 mb-4 text-center">
        お探しのページは存在しないか、URLが間違っている可能性があります。
      </p>
      <Link
        href="/dosuru"
        className="mt-4 rounded-md bg-gray-700 px-8 py-4 text-xl text-gray-300 transition-colors hover:bg-gray-600"
      >
        一覧へ戻る
      </Link>
    </main>
  );
}
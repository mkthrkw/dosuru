/**
 * 配列から指定されたインデックスの要素を削除します。
 *
 * @param array - 操作対象の配列。
 * @param index - 削除する要素のインデックス。
 * @returns 要素が削除された新しい配列。
 */
export function arrayRemove<T>(array: T[], index: number): T[] {
  return array.filter((_, i) => i !== index);
}

/**
 * 配列の指定されたインデックスに要素を挿入します。
 *
 * @param array - 操作対象の配列。
 * @param index - 要素を挿入するインデックス。
 * @param value - 挿入する要素。
 * @returns 要素が挿入された新しい配列。
 */
export function arrayInsert<T>(array: T[], index: number, value: T): T[] {
  return [...array.slice(0, index), value, ...array.slice(index)];
}

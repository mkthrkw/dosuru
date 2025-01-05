/**
 * オブジェクトから指定されたキーのみを持つ新しいオブジェクトを作成します。
 *
 * @param obj - 元のオブジェクト。
 * @param keys - 抽出するキーの配列。
 * @returns 指定されたキーのみを持つ新しいオブジェクト。
 *
 * @example
 * const myObject = { a: 1, b: 2, c: 3 };
 * const pickedObject = pickObject(myObject, ['a', 'c']);
 * // pickedObject は { a: 1, c: 3 } となります。
 */
export const pickObject = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

/**
 * オブジェクトから指定されたキーを除外した新しいオブジェクトを作成します。
 *
 * @param obj - 元のオブジェクト。
 * @param keys - 除外するキーの配列。
 * @returns 指定されたキーを除外した新しいオブジェクト。
 *
 * @example
 * const myObject = { a: 1, b: 2, c: 3 };
 * const omittedObject = omitObject(myObject, ['b']);
 * // omittedObject は { a: 1, c: 3 } となります。
 */
export const omitObject = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

/**
 * 2つのオブジェクトを比較して、最初に異なる値を持つプロパティのキーを返します。
 *
 * @param obj1 - 比較する最初のオブジェクト。
 * @param obj2 - 比較する2番目のオブジェクト。
 * @returns 最初に異なる値を持つプロパティのキー。すべてのプロパティが一致する場合は `undefined`。
 *
 * @example
 * const obj1 = { a: 1, b: 2, c: 3 };
 * const obj2 = { a: 1, b: 4, c: 3 };
 * const diffKey = findFirstDifferenceKey(obj1, obj2);
 * // diffKey は 'b' となります。
 */
export const findFirstDifferenceKey = <T1 extends object, T2 extends object>(
  obj1: T1,
  obj2: T2,
): keyof T1 | undefined => {
  return Object.entries(obj1).find(([key, newValue]) => {
    const oldValue = obj2[key as keyof T2];
    if (!newValue && !oldValue) return false;
    if (newValue instanceof Date && oldValue instanceof Date) {
      return newValue.getTime() !== oldValue.getTime();
    }
    return newValue !== oldValue;
  })?.[0] as keyof T1 | undefined;
};

import { format } from "@formkit/tempo";

/**
 * Dateオブジェクトを`YYYY年MM月DD日(d) HH:mm:ss`形式の文字列にフォーマットします。
 *
 * @param {Date | null | undefined} date フォーマットするDateオブジェクト。nullまたはundefinedの場合は空文字列を返します。
 * @returns {string} フォーマットされた日付と時間の文字列。
 *
 * @example
 * const date = new Date(2024, 0, 20, 10, 30, 45);
 * const formattedDate = getDateTimeFullStyle(date);
 * console.log(formattedDate); // "2024年01月20日(土) 10:30:45"
 */
export function getDateTimeFullStyle(date: Date | null | undefined): string {
  if (!date) return "";
  try {
    return format(date, "YYYY年MM月DD日(d) HH:mm:ss", "ja");
  } catch (error) {
    console.error(`Failed to format date: ${error}`);
    return "";
  }
}

/**
 * Dateオブジェクトを`YYYY/MM/DD`形式の文字列にフォーマットします。
 *
 * @param {Date | null | undefined} date フォーマットするDateオブジェクト。nullまたはundefinedの場合は空文字列を返します。
 * @returns {string} フォーマットされた日付文字列。
 *
 *  @example
 * const date = new Date(2024, 0, 20);
 * const formattedDate = getDateOnlyShortStyle(date);
 * console.log(formattedDate); // "2024/01/20"
 */
export function getDateOnlyShortStyle(date: Date | null | undefined): string {
  if (!date) return "";
  try {
    return format(date, "YYYY/MM/DD", "ja");
  } catch (error) {
    console.error(`Failed to format date: ${error}`);
    return "";
  }
}

/**
 * Dateオブジェクトを`YYYY-MM-DD`形式の文字列にフォーマットします。
 * HTMLのinput type="date" で使用することを想定しています。
 *
 * @param {Date | null | undefined} date フォーマットするDateオブジェクト。nullまたはundefinedの場合は空文字列を返します。
 * @returns {string | null} フォーマットされた日付文字列。
 *
 * @example
 * const date = new Date(2024, 0, 20);
 * const formattedDate = getDateInputStyle(date);
 * console.log(formattedDate); // "2024-01-20"
 */
export function getDateInputStyle(date: Date | null | undefined): string | null {
  if (!date) return "";
  try {
    return format(date, "YYYY-MM-DD");
  } catch (error) {
    console.error(`Failed to format date: ${error}`);
    return "";
  }
}

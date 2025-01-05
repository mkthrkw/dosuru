"use client";

import { AsideButton } from "@/app/_components/buttons/AsideButton";
import { CommonModal } from "@/app/_components/modals/CommonModal";
import { useEffect, useRef } from "react";
import { themeChange } from "theme-change";

export function ThemeSelector() {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    themeChange(false) // false parameter is required for react project
  }, [])

  const handleThemeChange = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  const ThemeCard = ({ theme, name }: { theme: string, name: string }) => {
    return (
      <button className="text-start outline-offset-4" onClick={() => handleThemeChange(theme)}>
        <span className="border border-base-content/20 bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans" data-theme={theme}>
          <span className="grid grid-cols-5 grid-rows-3">
            <span className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="invisible h-3 w-3 shrink-0">
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
              </svg>
              <span className="flex-grow text-sm">{name}</span>
              <span className="flex h-full shrink-0 flex-wrap gap-1">
                <span className="bg-primary rounded-badge w-2"></span>
                <span className="bg-secondary rounded-badge w-2"></span>
                <span className="bg-accent rounded-badge w-2"></span>
                <span className="bg-neutral rounded-badge w-2"></span>
              </span>
            </span>
          </span>
        </span>
      </button>
    )
  }

  const themeArray = [
    { theme: "cupcake", name: "カップケーキ" },
    { theme: "synthwave", name: "シンセウェイブ" },
    { theme: "retro", name: "レトロ" },
    { theme: "cyberpunk", name: "サイバーパンク" },
    { theme: "valentine", name: "バレンタイン" },
    { theme: "halloween", name: "ハロウィン" },
    { theme: "aqua", name: "アクア" },
    { theme: "pastel", name: "パステル" },
    { theme: "cmyk", name: "CMYK" },
    { theme: "lemonade", name: "レモネード" },
    { theme: "coffee", name: "コーヒー" },
    { theme: "dim", name: "ディム" },
    { theme: "nord", name: "ノード" },
  ];


  return (
    <>
      <AsideButton onClick={() => dialog.current?.showModal()}>
        テーマ選択
      </AsideButton>
      <CommonModal
        dialog={dialog}
        title="テーマ選択"
      >
        <div className="grid grid-cols-1 gap-3 p-3">
          {themeArray.map((theme) => (
            <ThemeCard theme={theme.theme} name={theme.name} key={theme.theme} />
          ))}
        </div>
      </CommonModal>
    </>
  );
}
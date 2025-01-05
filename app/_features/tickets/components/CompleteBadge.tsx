import React from 'react'

export function CompleteBadge({
  completed
}:{
  completed:boolean
}) {

  const badgeColor = completed ? "bg-success/80 text-base-100/90" : "bg-base-content/60 text-base-100/70";
  const message = completed ? "完了" : "未完了";
  const baseClass = "text-xs rounded-full w-16 text-center";

  return (
    <>
      <div className={baseClass + " " + badgeColor}>
        {message}
      </div>
    </>
  )
}
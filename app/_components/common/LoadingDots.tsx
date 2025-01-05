import React from 'react'

export function LoadingDots() {
  return (
    <div className='w-screen h-screen top-0 left-0 fixed flex justify-center items-center bg-base-content/30 z-[1000]'>
      <span className="loading loading-dots w-64 text-base-content/70"></span>
    </div>
  )
}
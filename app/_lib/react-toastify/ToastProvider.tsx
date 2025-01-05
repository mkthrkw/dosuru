"use client";

import "react-toastify/dist/ReactToastify.css";
import { Flip, ToastContainer } from "react-toastify";

export function ToastProvider(
  { children }: {children: React.ReactNode;}) {

  return (
    <>
      {children}
      <ToastContainer
        toastClassName={"rounded-2xl w-80 text-center text-sm mx-auto mb-2"}
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Flip}
      />
    </>
  );
}
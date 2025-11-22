'use client'

import logout from "@/actions/logout";
import { MouseEventHandler } from "react";

export default function Logout() {
  const onClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    logout();
  }

  return (
    <button onClick={onClick} className="bg-gray-200 text-gray-600 px-5 py-2 rounded-sm cursor-pointer hover:bg-gray-300 transition">ログアウト</button>
  )
}
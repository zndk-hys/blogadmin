'use client'

import logout from "@/actions/logout";
import { MouseEventHandler } from "react";

export default function Logout() {
  const onClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    logout();
  }

  return (
    <button onClick={onClick}>ログアウト</button>
  )
}
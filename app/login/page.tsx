'use client'

import login from "@/actions/login";
import { useState } from "react";

export default function Page() {
  const [message, setMessage] = useState('');

  const onLogin = async (formData: FormData) => {
    setMessage('');
    const response = await login(formData);
    if (response.error) {
      setMessage(response.message);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form action={onLogin}>
        <div className="mb-4">
          <input type="text" name="user" placeholder="ユーザー名" className="bg-gray-100 w-full px-3 py-3 rounded-sm" />
        </div>
        <div className="mb-4">
          <input type="password" name="password" placeholder="パスワード" className="bg-gray-100 w-full px-3 py-3 rounded-sm" />
        </div>
        <div className="text-center">
          <button className="bg-blue-400 text-white px-10 py-2 rounded-sm cursor-pointer hover:bg-blue-500 transition">ログイン</button>
        </div>
        {message && (
          <div className="text-center mt-3 text-red-400">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
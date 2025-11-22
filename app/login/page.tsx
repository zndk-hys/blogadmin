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
    <form action={onLogin}>
      <div>
        <input type="text" name="user" />
      </div>
      <div>
        <input type="password" name="password" />
      </div>
      <div>
        <button>ログイン</button>
      </div>
      <div>
        {message}
      </div>
    </form>
  );
}
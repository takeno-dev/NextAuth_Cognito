"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "サインアップに失敗しました");
      }

      // サインアップ成功後、ログインページへリダイレクト
      router.push("/login?success=Account created successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          パスワード
        </label>
        <input
          id="password"
          type="password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          パスワード（確認）
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {isLoading ? "作成中..." : "アカウント作成"}
      </button>
      <div className="text-center text-sm">
        <Link href="/login" className="text-blue-600 hover:text-blue-500">
          すでにアカウントをお持ちの方はこちら
        </Link>
      </div>
    </form>
  );
}

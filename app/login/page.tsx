import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import LoginForm from "./login-form";
import Link from "next/link";

export default async function LoginPage() {
  const session = await getServerSession();

  // すでにログインしている場合はホームページにリダイレクト
  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            ログイン
          </h2>
        </div>
        <LoginForm />
        <div className="text-center text-sm mt-4">
          <Link href="/signup" className="text-blue-600 hover:text-blue-500">
            アカウントをお持ちでない方はこちら
          </Link>
        </div>
      </div>
    </main>
  );
}
